import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  RoomServiceClient, 
  AccessToken, 
  Room
} from 'livekit-server-sdk';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient;
  private livekitUrl: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(private configService: ConfigService) {
    this.livekitUrl = this.configService.get<string>('LIVEKIT_URL')!;
    this.apiKey = this.configService.get<string>('LIVEKIT_API_KEY')!;
    this.apiSecret = this.configService.get<string>('LIVEKIT_API_SECRET')!;

    if (!this.livekitUrl || !this.apiKey || !this.apiSecret) {
      console.warn('LiveKit configuration is missing. Some features will be disabled.');
      console.warn('Please add LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET to your .env file');
      return;
    }

    this.roomService = new RoomServiceClient(this.livekitUrl, this.apiKey, this.apiSecret);
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      const room = await this.roomService.createRoom({
        name: createRoomDto.name,
        metadata: createRoomDto.metadata || '',
        emptyTimeout: createRoomDto.emptyTimeout ? 300 : 0,
        departureTimeout: createRoomDto.departureTimeout ? 60 : 0,
      });
      return room;
    } catch (error) {
      throw new BadRequestException(`Failed to create room: ${error.message}`);
    }
  }

  async listRooms(): Promise<Room[]> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      const rooms = await this.roomService.listRooms();
      return rooms;
    } catch (error) {
      throw new BadRequestException(`Failed to list rooms: ${error.message}`);
    }
  }

  async deleteRoom(roomName: string): Promise<void> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      await this.roomService.deleteRoom(roomName);
    } catch (error) {
      throw new BadRequestException(`Failed to delete room: ${error.message}`);
    }
  }

  async getRoomInfo(roomName: string): Promise<Room> {
    try {
      const rooms = await this.listRooms();
      const room = rooms.find(r => r.name === roomName);
      if (!room) {
        throw new BadRequestException(`Room ${roomName} not found`);
      }
      return room;
    } catch (error) {
      throw new BadRequestException(`Failed to get room info: ${error.message}`);
    }
  }

  async listParticipants(roomName: string): Promise<any[]> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      const participants = await this.roomService.listParticipants(roomName);
      return participants;
    } catch (error) {
      throw new BadRequestException(`Failed to list participants: ${error.message}`);
    }
  }

  async createAccessToken(createTokenDto: CreateTokenDto): Promise<string> {
    if (!this.apiKey || !this.apiSecret) {
      throw new BadRequestException('LiveKit API credentials are not configured.');
    }

    try {
      const at = new AccessToken(this.apiKey, this.apiSecret, {
        identity: createTokenDto.identity || createTokenDto.participantName,
        name: createTokenDto.participantName,
        metadata: createTokenDto.metadata || '',
      });

      at.addGrant({
        roomJoin: true,
        room: createTokenDto.roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      return await at.toJwt();
    } catch (error) {
      throw new BadRequestException(`Failed to create access token: ${error.message}`);
    }
  }

  async joinRoom(joinRoomDto: JoinRoomDto): Promise<{ token: string; url: string }> {
    try {
      // First, ensure the room exists or create it
      let room: Room;
      try {
        room = await this.getRoomInfo(joinRoomDto.roomName);
      } catch (error) {
        // Room doesn't exist, create it
        room = await this.createRoom({
          name: joinRoomDto.roomName,
          metadata: joinRoomDto.metadata,
        });
      }

      // Create access token
      const token = await this.createAccessToken({
        roomName: joinRoomDto.roomName,
        participantName: joinRoomDto.participantName,
        identity: joinRoomDto.identity,
        metadata: joinRoomDto.metadata,
      });

      return {
        token,
        url: this.livekitUrl,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to join room: ${error.message}`);
    }
  }

  async removeParticipant(roomName: string, identity: string): Promise<void> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      await this.roomService.removeParticipant(roomName, identity);
    } catch (error) {
      throw new BadRequestException(`Failed to remove participant: ${error.message}`);
    }
  }

  // Method to handle webhook events
  async handleWebhookEvent(event: any): Promise<void> {
    console.log('LiveKit webhook event received:', event);
    
    switch (event.event) {
      case 'room_started':
        console.log(`Room ${event.room?.name} started`);
        break;
      case 'room_finished':
        console.log(`Room ${event.room?.name} finished`);
        break;
      case 'participant_joined':
        console.log(`Participant ${event.participant?.identity} joined room ${event.room?.name}`);
        break;
      case 'participant_left':
        console.log(`Participant ${event.participant?.identity} left room ${event.room?.name}`);
        break;
      case 'track_published':
        console.log(`Track published in room ${event.room?.name} by ${event.participant?.identity}`);
        break;
      case 'track_unpublished':
        console.log(`Track unpublished in room ${event.room?.name} by ${event.participant?.identity}`);
        break;
      default:
        console.log('Unknown event type:', event.event);
    }
  }

  // Method to check if LiveKit is properly configured
  isConfigured(): boolean {
    return !!(this.livekitUrl && this.apiKey && this.apiSecret && this.roomService);
  }

  // Method to get LiveKit connection info
  getConnectionInfo(): { url: string; configured: boolean } {
    return {
      url: this.livekitUrl || '',
      configured: this.isConfigured(),
    };
  }

  // Method to update room metadata
  async updateRoomMetadata(roomName: string, metadata: string): Promise<Room> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      const room = await this.roomService.updateRoomMetadata(roomName, metadata);
      return room;
    } catch (error) {
      throw new BadRequestException(`Failed to update room metadata: ${error.message}`);
    }
  }

  // Method to mute/unmute participant
  async mutePublishedTrack(roomName: string, identity: string, trackSid: string, muted: boolean): Promise<void> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      await this.roomService.mutePublishedTrack(roomName, identity, trackSid, muted);
    } catch (error) {
      throw new BadRequestException(`Failed to ${muted ? 'mute' : 'unmute'} participant track: ${error.message}`);
    }
  }

  // Method to send data message to room
  async sendDataMessage(roomName: string, data: string, participantIdentities?: string[]): Promise<void> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      const dataBytes = new TextEncoder().encode(data);
      // Import DataPacket_Kind if needed, for now we'll use a simpler approach
      console.log(`Sending data to room ${roomName}:`, data);
      // Note: This is a placeholder implementation
      // In a full implementation, you would properly use LiveKit's data sending capabilities
    } catch (error) {
      throw new BadRequestException(`Failed to send data message: ${error.message}`);
    }
  }

  // Method to get room statistics
  async getRoomStats(roomName: string): Promise<any> {
    if (!this.roomService) {
      throw new BadRequestException('LiveKit is not configured. Please add LiveKit environment variables.');
    }

    try {
      const room = await this.getRoomInfo(roomName);
      const participants = await this.listParticipants(roomName);
      
      return {
        room: {
          name: room.name,
          creationTime: room.creationTime,
          metadata: room.metadata,
          numParticipants: room.numParticipants,
          maxParticipants: room.maxParticipants,
        },
        participants: participants.map((p: any) => ({
          identity: p.identity,
          name: p.name,
          state: p.state,
          metadata: p.metadata,
          joinedAt: p.joinedAt,
        })),
        totalParticipants: participants.length,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get room statistics: ${error.message}`);
    }
  }
}