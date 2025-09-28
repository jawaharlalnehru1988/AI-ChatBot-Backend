import { Controller, Post, Get, Body, Param, BadRequestException } from '@nestjs/common';
import { AiLivekitService, AIAssistantRoomOptions } from './ai-livekit.service';

export class CreateAIRoomDto {
  roomName: string;
  participantName: string;
  aiAssistantName?: string;
  systemPrompt?: string;
}

export class JoinAIRoomDto {
  roomName: string;
  participantName: string;
}

export class SendMessageDto {
  roomName: string;
  message: string;
  participantId?: string;
}

@Controller('ai-livekit')
export class AiLivekitController {
  constructor(private readonly aiLivekitService: AiLivekitService) {}

  @Post('create-room')
  async createAIAssistantRoom(@Body() createAIRoomDto: CreateAIRoomDto) {
    try {
      return await this.aiLivekitService.createAIAssistantRoom(createAIRoomDto);
    } catch (error) {
      throw new BadRequestException(`Failed to create AI assistant room: ${error.message}`);
    }
  }

  @Post('join-room')
  async joinAIAssistantRoom(@Body() joinAIRoomDto: JoinAIRoomDto) {
    try {
      return await this.aiLivekitService.joinAIAssistantRoom(
        joinAIRoomDto.roomName,
        joinAIRoomDto.participantName,
      );
    } catch (error) {
      throw new BadRequestException(`Failed to join AI assistant room: ${error.message}`);
    }
  }

  @Post('send-message')
  async sendMessageToAI(@Body() sendMessageDto: SendMessageDto) {
    try {
      const response = await this.aiLivekitService.sendMessageToAI(
        sendMessageDto.roomName,
        sendMessageDto.message,
        sendMessageDto.participantId,
      );
      
      return {
        response,
        timestamp: new Date(),
        roomName: sendMessageDto.roomName,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to send message to AI: ${error.message}`);
    }
  }

  @Get('rooms/:roomName/chat-history')
  async getChatHistory(@Param('roomName') roomName: string) {
    try {
      const history = await this.aiLivekitService.getChatHistory(roomName);
      return {
        roomName,
        chatHistory: history.filter(msg => msg.role !== 'system'), // Don't expose system prompt
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get chat history: ${error.message}`);
    }
  }

  @Post('rooms/:roomName/clear-history')
  async clearChatHistory(@Param('roomName') roomName: string) {
    try {
      await this.aiLivekitService.clearChatHistory(roomName);
      return { success: true, message: 'Chat history cleared' };
    } catch (error) {
      throw new BadRequestException(`Failed to clear chat history: ${error.message}`);
    }
  }

  @Post('rooms/:roomName/summary')
  async generateMeetingSummary(@Param('roomName') roomName: string) {
    try {
      const summary = await this.aiLivekitService.generateMeetingSummary(roomName);
      return {
        roomName,
        summary,
        generatedAt: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`Failed to generate meeting summary: ${error.message}`);
    }
  }

  @Post('webhook')
  async handleAIWebhook(@Body() body: any) {
    try {
      await this.aiLivekitService.handleRoomEvent(body);
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`AI webhook processing failed: ${error.message}`);
    }
  }
}