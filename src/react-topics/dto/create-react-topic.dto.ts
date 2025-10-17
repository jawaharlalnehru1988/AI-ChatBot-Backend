import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, IsBoolean, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class McqContentDto {
  @ApiProperty({
    description: 'MCQ question text',
    example: 'What is React primarily used for?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Array of answer options',
    example: ['Building user interfaces', 'Managing application state', 'Handling user input', 'All of the above'],
  })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    description: 'The correct answer',
    example: 'Building user interfaces',
  })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;
}

export class CreateReactTopicDto {
  @ApiProperty({
    description: 'Unique identifier for the topic',
    example: 'what-is-react',
  })
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @ApiProperty({
    description: 'Title of the topic',
    example: 'What is React?',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the topic',
    example: 'Difference from Angular, React philosophy',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Estimated time to complete',
    example: '30 min',
  })
  @IsString()
  @IsNotEmpty()
  estimatedTime: string;

  @ApiProperty({
    description: 'HTML content for the topic',
    example: '<h1>What is React?</h1><p>React is a JavaScript library...</p>',
    required: false,
  })
  @IsString()
  @IsOptional()
  htmlContent?: string;

  @ApiProperty({
    description: 'Array of MCQ questions for the topic',
    type: [McqContentDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => McqContentDto)
  @IsOptional()
  mcqContent?: McqContentDto[];

  @ApiProperty({
    description: 'Whether the topic is completed',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}
