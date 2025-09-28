import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomServiceClient, AccessToken, DataPacket_Kind } from 'livekit-server-sdk';
import { OpenaiService } from '../openai/openai.service';
import { CreateOpenaiDto } from '../openai/dto/create-openai.dto';

export interface StreamingChatRequest {
  roomName: string;
  participantName: string;
  messages: Array<{ role: string; content: string; name?: string }>;
}

export interface StreamingResponse {
  type: 'chunk' | 'complete' | 'error';
  content: string;
  timestamp: string;
  participantName?: string;
}

@Injectable()
export class RealtimeChatService {
  private roomService: RoomServiceClient;
  private livekitUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(
    private configService: ConfigService,
    private openaiService: OpenaiService,
  ) {
    this.livekitUrl = this.configService.get<string>('LIVEKIT_URL')!;
    this.apiKey = this.configService.get<string>('LIVEKIT_API_KEY')!;
    this.apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET')!;

    if (!this.livekitUrl || !this.apiKey || !this.apiSecret) {
      throw new Error('LiveKit configuration is missing. Please check your environment variables.');
    }

    this.roomService = new RoomServiceClient(this.livekitUrl, this.apiKey, this.apiSecret);
  }

  async createStreamingRoom(roomName: string, participantName: string): Promise<{ token: string; url: string }> {
    try {
      // Create or ensure room exists
      await this.roomService.createRoom({
        name: roomName,
        metadata: JSON.stringify({
          type: 'streaming-chat',
          createdAt: new Date().toISOString(),
        }),
      });

      // Create access token for the participant
      const at = new AccessToken(this.apiKey, this.apiSecret, {
        identity: participantName,
        name: participantName,
      });

      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true, // Important for data streaming
      });

      return {
        token: await at.toJwt(),
        url: this.livekitUrl,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to create streaming room: ${error.message}`);
    }
  }

  async streamChatCompletion(request: StreamingChatRequest): Promise<void> {
    try {
      const { roomName, participantName, messages } = request;

      // Create OpenAI DTO
      const createOpenaiDto: CreateOpenaiDto = { messages };

      // Get streaming response from OpenAI
      const streamGenerator = this.openaiService.createStreamingChatCompletion(createOpenaiDto);

      let fullResponse = '';

      // Stream each chunk to the room via data packets
      for await (const chunk of streamGenerator) {
        const streamingResponse: StreamingResponse = {
          type: chunk.isComplete ? 'complete' : 'chunk',
          content: chunk.content,
          timestamp: chunk.timestamp,
          participantName: 'AI Assistant',
        };

        fullResponse += chunk.content;

        // Send data packet to all participants in the room
        await this.sendDataToRoom(roomName, streamingResponse);

        // Small delay to make streaming more visible (optional)
        if (!chunk.isComplete) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      console.log(`Streaming complete for room ${roomName}. Full response: ${fullResponse}`);
    } catch (error) {
      // Send error to room
      const errorResponse: StreamingResponse = {
        type: 'error',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
      };
      
      await this.sendDataToRoom(request.roomName, errorResponse);
      throw new BadRequestException(`Streaming failed: ${error.message}`);
    }
  }

  private async sendDataToRoom(roomName: string, data: StreamingResponse): Promise<void> {
    try {
      // Convert data to JSON string
      const jsonData = JSON.stringify(data);
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(jsonData);

      // Send data packet to room (simplified approach)
      console.log(`Sending data to room ${roomName}:`, data);
      // Note: In a real implementation, you would use LiveKit's data channel API
      // For now, we'll log the data and rely on WebSocket connections from the client
    } catch (error) {
      console.error('Failed to send data to room:', error);
    }
  }

  async listActiveRooms(): Promise<any[]> {
    try {
      return await this.roomService.listRooms();
    } catch (error) {
      throw new BadRequestException(`Failed to list rooms: ${error.message}`);
    }
  }

  async deleteRoom(roomName: string): Promise<void> {
    try {
      await this.roomService.deleteRoom(roomName);
    } catch (error) {
      throw new BadRequestException(`Failed to delete room: ${error.message}`);
    }
  }
}