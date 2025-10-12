import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateAnswerDto {
  @ApiProperty({
    description: 'ID of the MCQ question',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({
    description: 'ID of the selected choice',
    example: 'a',
  })
  @IsString()
  @IsNotEmpty()
  selectedAnswer: string;
}
