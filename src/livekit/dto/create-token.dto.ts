import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateTokenDto {
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

  @IsOptional()
  @IsArray()
  permissions?: string[];
}