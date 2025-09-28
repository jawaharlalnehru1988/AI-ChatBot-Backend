import { Controller, Post, Get, Body, Param, Delete, Sse, MessageEvent } from '@nestjs/common';
import { RealtimeChatService, StreamingChatRequest } from './realtime-chat.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export class CreateStreamingRoomDto {
  roomName: string;
  participantName: string;
}

export class StreamChatDto {
  roomName: string;
  participantName: string;
  messages: Array<{ role: string; content: string; name?: string }>;
}

@Controller('realtime-chat')
export class RealtimeChatController {
  private streamingSubjects: Map<string, Subject<any>> = new Map();

  constructor(private readonly realtimeChatService: RealtimeChatService) {}

  @Post('create-room')
  async createStreamingRoom(@Body() createRoomDto: CreateStreamingRoomDto) {
    const result = await this.realtimeChatService.createStreamingRoom(
      createRoomDto.roomName,
      createRoomDto.participantName,
    );

    return {
      ...result,
      roomName: createRoomDto.roomName,
      participantName: createRoomDto.participantName,
      message: 'Room created successfully. Use the token to connect to LiveKit and the streaming endpoint to get real-time responses.',
    };
  }

  @Get('rooms')
  async listActiveRooms() {
    return this.realtimeChatService.listActiveRooms();
  }

  @Delete('rooms/:roomName')
  async deleteRoom(@Param('roomName') roomName: string) {
    await this.realtimeChatService.deleteRoom(roomName);
    
    // Clean up streaming subject
    if (this.streamingSubjects.has(roomName)) {
      this.streamingSubjects.get(roomName)?.complete();
      this.streamingSubjects.delete(roomName);
    }

    return { message: 'Room deleted successfully' };
  }

  @Post('stream')
  async startStreamingChat(@Body() streamChatDto: StreamChatDto) {
    try {
      // Start the streaming in the background
      this.realtimeChatService.streamChatCompletion(streamChatDto);
      
      return {
        message: 'Streaming started',
        roomName: streamChatDto.roomName,
        streamingEndpoint: `/realtime-chat/stream/${streamChatDto.roomName}`,
      };
    } catch (error) {
      throw error;
    }
  }

  @Sse('stream/:roomName')
  streamChatCompletionSSE(@Param('roomName') roomName: string): Observable<MessageEvent> {
    // Create a subject for this room if it doesn't exist
    if (!this.streamingSubjects.has(roomName)) {
      this.streamingSubjects.set(roomName, new Subject());
    }

    const subject = this.streamingSubjects.get(roomName)!;

    return subject.asObservable().pipe(
      map((data) => ({
        data: JSON.stringify(data),
        type: 'chat-chunk',
      } as MessageEvent)),
    );
  }

  // Method to push data to streaming clients (called from service)
  pushToStream(roomName: string, data: any) {
    const subject = this.streamingSubjects.get(roomName);
    if (subject) {
      subject.next(data);
    }
  }
}