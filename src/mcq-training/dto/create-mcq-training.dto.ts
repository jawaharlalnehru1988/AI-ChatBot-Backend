import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ChoiceDto {
  @ApiProperty({
    description: 'Unique identifier for the choice',
    example: 'a',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Text content of the choice',
    example: 'React is a JavaScript library for building user interfaces',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CreateMcqTrainingDto {
  @ApiProperty({
    description: 'Topic of the MCQ question',
    example: 'agentic-ai',
    enum: ['react', 'angular', 'springboot', 'agentic-ai', 'nodejs', 'mongodb', 'typescript'],
  })
  @IsString()
  @IsNotEmpty()
  topic: string;

  @ApiProperty({
    description: 'Difficulty level (1, 2, or 3)',
    example: 1,
    minimum: 1,
    maximum: 3,
  })
  @IsNumber()
  @Min(1)
  @Max(3)
  level: number;

  @ApiProperty({
    description: 'The question text',
    example: 'What is an AI agent?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Array of 4 choices',
    type: [ChoiceDto],
    example: [
      { id: 'a', text: 'A software program that performs tasks autonomously' },
      { id: 'b', text: 'A database management system' },
      { id: 'c', text: 'A web framework' },
      { id: 'd', text: 'A testing tool' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices: ChoiceDto[];

  @ApiProperty({
    description: 'ID of the correct choice',
    example: 'a',
  })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @ApiProperty({
    description: 'Explanation of why this is the correct answer',
    example: 'An AI agent is a software program that can perceive its environment, make decisions, and take actions autonomously to achieve specific goals.',
  })
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiProperty({
    description: 'Points awarded for correct answer',
    example: 10,
    required: false,
    default: 10,
  })
  @IsNumber()
  @Min(1)
  points?: number;

  @ApiProperty({
    description: 'Difficulty tag',
    example: 'medium',
    enum: ['easy', 'medium', 'hard'],
    required: false,
  })
  @IsString()
  difficulty?: string;
}
