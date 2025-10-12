import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class Choice {
  @ApiProperty({
    description: 'Unique identifier for the choice',
    example: 'a',
  })
  id: string;

  @ApiProperty({
    description: 'Text content of the choice',
    example: 'React is a JavaScript library for building user interfaces',
  })
  text: string;
}

@Schema({ timestamps: true })
export class McqTraining extends Document {
  @ApiProperty({
    description: 'Topic of the MCQ question',
    example: 'agentic-ai',
  })
  @Prop({ required: true, index: true })
  topic: string;

  @ApiProperty({
    description: 'Difficulty level (1, 2, or 3)',
    example: 1,
  })
  @Prop({ required: true, index: true })
  level: number;

  @ApiProperty({
    description: 'The question text',
    example: 'What is an AI agent?',
  })
  @Prop({ required: true })
  question: string;

  @ApiProperty({
    description: 'Array of 4 choices',
    type: [Choice],
  })
  @Prop({ required: true, type: [{ id: String, text: String }] })
  choices: Choice[];

  @ApiProperty({
    description: 'ID of the correct choice',
    example: 'a',
  })
  @Prop({ required: true })
  correctAnswer: string;

  @ApiProperty({
    description: 'Explanation of why this is the correct answer',
    example: 'An AI agent is a software program that can perceive its environment, make decisions, and take actions autonomously to achieve specific goals.',
  })
  @Prop({ required: true })
  explanation: string;

  @ApiProperty({
    description: 'Points awarded for correct answer',
    example: 10,
  })
  @Prop({ default: 10 })
  points: number;

  @ApiProperty({
    description: 'Difficulty tag',
    example: 'medium',
  })
  @Prop({ default: 'medium' })
  difficulty: string;
}

export const McqTrainingSchema = SchemaFactory.createForClass(McqTraining);
