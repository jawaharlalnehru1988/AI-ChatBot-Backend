import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSystemdesignDto {
  @ApiProperty({
    description: 'Title of the system design topic',
    example: 'From Requirements to Architecture',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the system design topic',
    example: 'Learn how to design systems that can scale efficiently and handle high traffic loads.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'URL of the image associated with the topic',
    example: 'https://res.cloudinary.com/dbmkctsda/image/upload/v1756956557/c937db99-2e3a-4173-ace3-626cea9956f8.png',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Category of the system design topic',
    example: 'High-Level-Design',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'URL-friendly link for the section',
    example: 'from-requirements-to-architecture',
  })
  @IsString()
  @IsNotEmpty()
  sectionLink: string;

  @ApiProperty({
    description: 'URL of the audio file for the topic',
    example: 'https://raw.githubusercontent.com/jawaharlalnehru1988/bgsloka/master/assets/high%20level%20design/ep2%20-%20from%20requirements%20to%20architecture.mp3',
  })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @ApiProperty({
    description: 'Detailed content or article text (optional)',
    example: 'Detailed markdown content about the topic...',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
