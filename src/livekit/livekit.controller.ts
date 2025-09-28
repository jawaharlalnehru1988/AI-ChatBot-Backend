import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  Headers,
  BadRequestException 
} from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('livekit')
export class LivekitController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post('rooms')
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.livekitService.createRoom(createRoomDto);
  }

  @Get('rooms')
  async listRooms() {
    return this.livekitService.listRooms();
  }

  @Get('rooms/:roomName')
  async getRoomInfo(@Param('roomName') roomName: string) {
    return this.livekitService.getRoomInfo(roomName);
  }

  @Delete('rooms/:roomName')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRoom(@Param('roomName') roomName: string) {
    return this.livekitService.deleteRoom(roomName);
  }

  @Get('rooms/:roomName/participants')
  async listParticipants(@Param('roomName') roomName: string) {
    return this.livekitService.listParticipants(roomName);
  }

  @Delete('rooms/:roomName/participants/:identity')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeParticipant(
    @Param('roomName') roomName: string,
    @Param('identity') identity: string,
  ) {
    return this.livekitService.removeParticipant(roomName, identity);
  }

  @Post('token')
  async createAccessToken(@Body() createTokenDto: CreateTokenDto) {
    const token = await this.livekitService.createAccessToken(createTokenDto);
    return { token };
  }

  @Post('join')
  async joinRoom(@Body() joinRoomDto: JoinRoomDto) {
    return this.livekitService.joinRoom(joinRoomDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() body: any,
    @Headers('authorization') authHeader: string,
  ) {
    // In a production environment, you should verify the webhook signature
    // For now, we'll just log and process the event
    try {
      await this.livekitService.handleWebhookEvent(body);
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Webhook processing failed: ${error.message}`);
    }
  }

  // Endpoint to get LiveKit connection info for frontend
  @Post('connection-info')
  async getConnectionInfo(@Body() joinRoomDto: JoinRoomDto) {
    const result = await this.livekitService.joinRoom(joinRoomDto);
    return {
      url: result.url,
      token: result.token,
      roomName: joinRoomDto.roomName,
      participantName: joinRoomDto.participantName,
    };
  }
}