import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  metadata?: string;

  @IsOptional()
  @IsBoolean()
  emptyTimeout?: boolean;

  @IsOptional()
  @IsBoolean()
  departureTimeout?: boolean;
}