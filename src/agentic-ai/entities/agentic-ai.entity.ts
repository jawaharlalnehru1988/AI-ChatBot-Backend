import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true })
export class AgenticAi extends Document {
  @ApiProperty({
    description: 'Title of the agentic AI topic',
    example: 'Introduction to AI Agents',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the agentic AI topic',
    example: 'Learn how to build autonomous AI agents that can reason, plan, and execute tasks.',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'URL of the image associated with the topic',
    example: 'https://res.cloudinary.com/dbmkctsda/image/upload/v1756956557/agentic-ai-intro.png',
  })
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty({
    description: 'Category of the agentic AI topic',
    example: 'AI-Fundamentals',
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'URL-friendly link for the section',
    example: 'introduction-to-ai-agents',
  })
  @Prop({ required: true, unique: true })
  sectionLink: string;

  @ApiProperty({
    description: 'URL of the audio file for the topic',
    example: 'https://example.com/audio/agentic-ai-intro.mp3',
  })
  @Prop({ required: true })
  audioUrl: string;

  @ApiProperty({
    description: 'Detailed content or article text',
    example: 'Detailed markdown content about AI agents...',
    required: false,
  })
  @Prop()
  content?: string;
}

export const AgenticAiSchema = SchemaFactory.createForClass(AgenticAi);
