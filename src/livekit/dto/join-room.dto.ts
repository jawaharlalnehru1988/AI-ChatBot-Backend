import { IsString, IsOptional } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  roomName: string;

  @IsString()
  participantName: string;

  @IsOptional()
  @IsString()
  identity?: string;

  @IsOptional()
  @IsString()
  metadata?: string;
}