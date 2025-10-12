import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgenticAiDto {
  @ApiProperty({
    description: 'Title of the agentic AI topic',
    example: 'Introduction to AI Agents',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the agentic AI topic',
    example: 'Learn how to build autonomous AI agents that can reason, plan, and execute tasks.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'URL of the image associated with the topic',
    example: 'https://res.cloudinary.com/dbmkctsda/image/upload/v1756956557/agentic-ai-intro.png',
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({
    description: 'Category of the agentic AI topic',
    example: 'AI-Fundamentals',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'URL-friendly link for the section',
    example: 'introduction-to-ai-agents',
  })
  @IsString()
  @IsNotEmpty()
  sectionLink: string;

  @ApiProperty({
    description: 'URL of the audio file for the topic',
    example: 'https://example.com/audio/agentic-ai-intro.mp3',
  })
  @IsString()
  @IsNotEmpty()
  audioUrl: string;

  @ApiProperty({
    description: 'Detailed content or article text (optional)',
    example: 'Detailed markdown content about AI agents...',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;
}
