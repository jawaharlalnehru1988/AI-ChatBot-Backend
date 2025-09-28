import { Injectable } from '@nestjs/common';
import { LivekitService } from '../livekit/livekit.service';
import { OpenaiService } from '../openai/openai.service';
import { CreateOpenaiDto } from '../openai/dto/create-openai.dto';

export interface AIAssistantRoomOptions {
  roomName: string;
  participantName: string;
  aiAssistantName?: string;
  systemPrompt?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  participantId?: string;
}

@Injectable()
export class AiLivekitService {
  private roomChatHistory: Map<string, ChatMessage[]> = new Map();

  constructor(
    private readonly livekitService: LivekitService,
    private readonly openaiService: OpenaiService,
  ) {}

  async createAIAssistantRoom(options: AIAssistantRoomOptions) {
    const {
      roomName,
      participantName,
      aiAssistantName = 'AI Assistant',
      systemPrompt = 'You are a helpful AI assistant in a video call. Provide concise, friendly responses.',
    } = options;

    // Create the room
    const room = await this.livekitService.createRoom({
      name: roomName,
      metadata: JSON.stringify({
        hasAIAssistant: true,
        aiAssistantName,
        systemPrompt,
      }),
    });

    // Initialize chat history for this room
    this.roomChatHistory.set(roomName, [
      {
        role: 'system',
        content: systemPrompt,
        timestamp: new Date(),
      },
    ]);

    // Create access token for the user
    const userToken = await this.livekitService.createAccessToken({
      roomName,
      participantName,
    });

    return {
      room,
      userToken,
      url: this.livekitService['livekitUrl'], // Access private property safely
      aiAssistantName,
    };
  }

  async sendMessageToAI(roomName: string, message: string, participantId?: string): Promise<string> {
    // Get or initialize chat history for this room
    let chatHistory = this.roomChatHistory.get(roomName) || [];
    
    // Add user message to history
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
      participantId,
    };
    chatHistory.push(userMessage);

    // Prepare messages for OpenAI
    const openaiMessages = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response
    const createOpenaiDto: CreateOpenaiDto = {
      messages: openaiMessages,
    };

    const aiResponse = await this.openaiService.createChatCompletion(createOpenaiDto);
    const aiContent = aiResponse.choices[0]?.message?.content || 'I apologize, but I cannot provide a response at the moment.';

    // Add AI response to history
    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: aiContent,
      timestamp: new Date(),
    };
    chatHistory.push(aiMessage);

    // Update chat history
    this.roomChatHistory.set(roomName, chatHistory);

    return aiContent;
  }

  async getChatHistory(roomName: string): Promise<ChatMessage[]> {
    return this.roomChatHistory.get(roomName) || [];
  }

  async clearChatHistory(roomName: string): Promise<void> {
    this.roomChatHistory.delete(roomName);
  }

  async joinAIAssistantRoom(roomName: string, participantName: string) {
    // Check if room exists and has AI assistant
    let room;
    try {
      room = await this.livekitService.getRoomInfo(roomName);
    } catch (error) {
      throw new Error(`Room ${roomName} not found`);
    }

    let metadata = {};
    try {
      metadata = JSON.parse(room.metadata || '{}');
    } catch (error) {
      // Ignore parsing errors
    }

    if (!metadata['hasAIAssistant']) {
      throw new Error('This room does not have an AI assistant enabled');
    }

    // Join the room
    const joinResult = await this.livekitService.joinRoom({
      roomName,
      participantName,
    });

    // Get chat history
    const chatHistory = await this.getChatHistory(roomName);

    return {
      ...joinResult,
      aiAssistantName: metadata['aiAssistantName'] || 'AI Assistant',
      chatHistory: chatHistory.filter(msg => msg.role !== 'system'), // Don't expose system prompt
    };
  }

  async handleRoomEvent(event: any): Promise<void> {
    // Handle LiveKit room events and potentially trigger AI responses
    console.log('AI-LiveKit room event:', event);

    switch (event.event) {
      case 'room_finished':
        // Clear chat history when room ends
        if (event.room?.name) {
          await this.clearChatHistory(event.room.name);
        }
        break;
      case 'participant_joined':
        // Could send a welcome message from AI
        console.log(`Participant joined AI room: ${event.participant?.identity}`);
        break;
      case 'participant_left':
        console.log(`Participant left AI room: ${event.participant?.identity}`);
        break;
    }

    // Also call the original LiveKit service handler
    await this.livekitService.handleWebhookEvent(event);
  }

  async generateMeetingSummary(roomName: string): Promise<string> {
    const chatHistory = await this.getChatHistory(roomName);
    
    if (chatHistory.length <= 1) { // Only system message
      return 'No conversation took place in this meeting.';
    }

    // Create a summary prompt
    const summaryPrompt = `
Please provide a concise summary of the following conversation from a video call meeting:

${chatHistory
  .filter(msg => msg.role !== 'system')
  .map(msg => `${msg.role === 'user' ? 'Participant' : 'AI Assistant'}: ${msg.content}`)
  .join('\n')}

Please summarize the key points discussed, decisions made, and action items if any.
`;

    const createOpenaiDto: CreateOpenaiDto = {
      messages: [
        { role: 'system', content: 'You are a meeting assistant that creates concise meeting summaries.' },
        { role: 'user', content: summaryPrompt },
      ],
    };

    const response = await this.openaiService.createChatCompletion(createOpenaiDto);
    return response.choices[0]?.message?.content || 'Unable to generate meeting summary.';
  }
}