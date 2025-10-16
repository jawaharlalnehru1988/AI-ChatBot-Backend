import { IsString, IsNotEmpty, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReactLearningDto {
  @ApiProperty({
    description: 'Unique identifier for the section',
    example: 'react-basics',
  })
  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @ApiProperty({
    description: 'Difficulty level',
    example: 'Beginner',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    description: 'Section title',
    example: 'React Basics',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Emoji representation',
    example: '🟢',
  })
  @IsString()
  @IsNotEmpty()
  emoji: string;

  @ApiProperty({
    description: 'Section description',
    example: 'Foundation Stage — Understand React\'s core building blocks',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Color theme',
    example: 'green',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: 'Gradient CSS class',
    example: 'from-green-400 to-emerald-500',
  })
  @IsString()
  @IsNotEmpty()
  gradient: string;

  @ApiProperty({
    description: 'Array of topic MongoDB ObjectIds (references to ReactTopic collection)',
    type: [String],
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    required: false,
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  topicIds?: string[];
}
