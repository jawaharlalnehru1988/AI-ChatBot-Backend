import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpenaiService } from '../openai/openai.service';
import { CreateOpenaiDto } from '../openai/dto/create-openai.dto';

interface StreamingClient {
  socketId: string;
  roomName?: string;
  participantName?: string;
}

@WebSocketGateway({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class StreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, StreamingClient> = new Map();

  constructor(private readonly openaiService: OpenaiService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, { socketId: client.id });
    
    client.emit('connected', {
      message: 'Connected to streaming server',
      clientId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomName: string; participantName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomName, participantName } = data;
    
    // Update client info
    this.clients.set(client.id, {
      socketId: client.id,
      roomName,
      participantName,
    });

    // Join socket room
    client.join(roomName);
    
    client.emit('room-joined', {
      roomName,
      participantName,
      message: `Joined room: ${roomName}`,
    });

    // Notify others in the room
    client.to(roomName).emit('participant-joined', {
      participantName,
      message: `${participantName} joined the room`,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const clientInfo = this.clients.get(client.id);
    if (clientInfo?.roomName) {
      client.leave(clientInfo.roomName);
      
      // Notify others in the room
      client.to(clientInfo.roomName).emit('participant-left', {
        participantName: clientInfo.participantName,
        message: `${clientInfo.participantName} left the room`,
      });

      // Update client info
      this.clients.set(client.id, { socketId: client.id });
      
      client.emit('room-left', {
        message: 'Left the room',
      });
    }
  }

  @SubscribeMessage('stream-chat')
  async handleStreamingChat(
    @MessageBody() data: { messages: Array<{ role: string; content: string }> },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const clientInfo = this.clients.get(client.id);
      if (!clientInfo) {
        client.emit('error', { message: 'Client not found' });
        return;
      }

      const createOpenaiDto: CreateOpenaiDto = {
        messages: data.messages,
      };

      // Send streaming start event
      client.emit('stream-start', {
        message: 'AI response streaming started...',
        timestamp: new Date().toISOString(),
      });

      // Also emit to room if client is in a room
      if (clientInfo.roomName) {
        client.to(clientInfo.roomName).emit('stream-start', {
          participantName: clientInfo.participantName,
          message: 'AI response streaming started...',
          timestamp: new Date().toISOString(),
        });
      }

      let fullResponse = '';

      // Get streaming response from OpenAI
      const streamGenerator = this.openaiService.createStreamingChatCompletion(createOpenaiDto);

      for await (const chunk of streamGenerator) {
        fullResponse += chunk.content;

        const streamData = {
          content: chunk.content,
          isComplete: chunk.isComplete,
          timestamp: chunk.timestamp,
          fullResponse: fullResponse,
        };

        // Send to the requesting client
        client.emit('stream-chunk', streamData);

        // Also send to room if client is in a room
        if (clientInfo.roomName) {
          client.to(clientInfo.roomName).emit('stream-chunk', {
            ...streamData,
            participantName: clientInfo.participantName,
          });
        }

        if (chunk.isComplete) {
          // Send final completion event
          client.emit('stream-complete', {
            fullResponse,
            timestamp: new Date().toISOString(),
            message: 'AI response completed',
          });

          if (clientInfo.roomName) {
            client.to(clientInfo.roomName).emit('stream-complete', {
              fullResponse,
              timestamp: new Date().toISOString(),
              participantName: clientInfo.participantName,
              message: 'AI response completed',
            });
          }
          break;
        }
      }

    } catch (error) {
      console.error('Streaming error:', error);
      
      client.emit('stream-error', {
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('get-room-info')
  handleGetRoomInfo(@ConnectedSocket() client: Socket) {
    const clientInfo = this.clients.get(client.id);
    client.emit('room-info', clientInfo || { socketId: client.id });
  }

  // Method to send messages to specific rooms (can be called from other services)
  sendToRoom(roomName: string, event: string, data: any) {
    this.server.to(roomName).emit(event, data);
  }

  // Method to send messages to specific clients
  sendToClient(clientId: string, event: string, data: any) {
    this.server.to(clientId).emit(event, data);
  }
}