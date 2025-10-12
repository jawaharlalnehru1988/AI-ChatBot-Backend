import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBody
} from '@nestjs/swagger';
import { McqTrainingService } from './mcq-training.service';
import { CreateMcqTrainingDto } from './dto/create-mcq-training.dto';
import { UpdateMcqTrainingDto } from './dto/update-mcq-training.dto';
import { ValidateAnswerDto } from './dto/validate-answer.dto';
import { McqTraining } from './entities/mcq-training.entity';

@ApiTags('mcq-training')
@Controller('mcq-training')
export class McqTrainingController {
  constructor(private readonly mcqTrainingService: McqTrainingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new MCQ question (Admin)' })
  @ApiResponse({ 
    status: 201, 
    description: 'The MCQ question has been successfully created.',
    type: McqTraining 
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid data' })
  create(@Body() createMcqTrainingDto: CreateMcqTrainingDto) {
    return this.mcqTrainingService.create(createMcqTrainingDto);
  }

  @Get('topics')
  @ApiOperation({ summary: 'Get all available topics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return list of all available topics.',
    type: [String],
    example: ['react', 'angular', 'springboot', 'agentic-ai']
  })
  getTopics() {
    return this.mcqTrainingService.getAvailableTopics();
  }

  @Get('topics-with-stats')
  @ApiOperation({ summary: 'Get all topics grouped with their statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all topics with question counts and level breakdowns.',
    schema: {
      example: [
        {
          topic: 'agentic-ai',
          totalQuestions: 200,
          levels: [
            { level: 1, count: 100 },
            { level: 2, count: 100 }
          ]
        },
        {
          topic: 'react',
          totalQuestions: 150,
          levels: [
            { level: 1, count: 50 },
            { level: 2, count: 50 },
            { level: 3, count: 50 }
          ]
        }
      ]
    }
  })
  getTopicsWithStats() {
    return this.mcqTrainingService.getAllTopicsWithStats();
  }

  @Get('topics/:topic/stats')
  @ApiOperation({ summary: 'Get detailed statistics for a specific topic' })
  @ApiParam({ 
    name: 'topic', 
    description: 'Topic name',
    example: 'agentic-ai' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return detailed statistics including difficulty breakdown for the topic.',
    schema: {
      example: {
        topic: 'agentic-ai',
        totalQuestions: 200,
        levels: [
          { 
            level: 1, 
            count: 100,
            difficulties: { easy: 30, medium: 50, hard: 20 }
          },
          { 
            level: 2, 
            count: 100,
            difficulties: { easy: 20, medium: 50, hard: 30 }
          }
        ],
        difficultyBreakdown: { easy: 50, medium: 100, hard: 50 }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  getTopicStats(@Param('topic') topic: string) {
    return this.mcqTrainingService.getTopicStats(topic);
  }

  @Get('topics/:topic/levels')
  @ApiOperation({ summary: 'Get available levels for a specific topic with details' })
  @ApiParam({ 
    name: 'topic', 
    description: 'Topic name',
    example: 'agentic-ai' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return list of available levels with question count and max points.',
    schema: {
      example: [
        { level: 1, count: 100, maxPoints: 1000 },
        { level: 2, count: 100, maxPoints: 1000 },
        { level: 3, count: 100, maxPoints: 1000 }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'No levels found for this topic' })
  getLevels(@Param('topic') topic: string) {
    return this.mcqTrainingService.getTopicLevels(topic);
  }

  @Get('topics/:topic/level/:level')
  @ApiOperation({ summary: 'Get all MCQ questions for a specific topic and level' })
  @ApiParam({ 
    name: 'topic', 
    description: 'Topic name',
    example: 'agentic-ai' 
  })
  @ApiParam({ 
    name: 'level', 
    description: 'Difficulty level (1, 2, or 3)',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all MCQ questions for the specified topic and level (without correct answers).',
    type: [McqTraining] 
  })
  @ApiResponse({ status: 404, description: 'No questions found' })
  getQuestionsByTopicAndLevel(
    @Param('topic') topic: string,
    @Param('level', ParseIntPipe) level: number
  ) {
    return this.mcqTrainingService.getQuestionsByTopicAndLevel(topic, level);
  }

  @Get('topics/:topic/level/:level/count')
  @ApiOperation({ summary: 'Get count of questions for a specific topic and level' })
  @ApiParam({ 
    name: 'topic', 
    description: 'Topic name',
    example: 'agentic-ai' 
  })
  @ApiParam({ 
    name: 'level', 
    description: 'Difficulty level (1, 2, or 3)',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return count of questions.',
    schema: { example: { count: 100 } }
  })
  getQuestionCount(
    @Param('topic') topic: string,
    @Param('level', ParseIntPipe) level: number
  ) {
    return this.mcqTrainingService.getQuestionCount(topic, level);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate user answer and get explanation' })
  @ApiBody({ type: ValidateAnswerDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Return validation result with correct answer and explanation.',
    schema: {
      example: {
        isCorrect: true,
        correctAnswer: 'a',
        explanation: 'An AI agent is a software program that can perceive its environment...',
        points: 10
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Question not found' })
  validateAnswer(@Body() validateAnswerDto: ValidateAnswerDto) {
    return this.mcqTrainingService.validateAnswer(validateAnswerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all MCQ questions (Admin)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all MCQ questions.',
    type: [McqTraining] 
  })
  findAll() {
    return this.mcqTrainingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single MCQ question by ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the MCQ question with the specified ID.',
    type: McqTraining 
  })
  @ApiResponse({ status: 404, description: 'Question not found' })
  findOne(@Param('id') id: string) {
    return this.mcqTrainingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an MCQ question (Admin)' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The MCQ question has been successfully updated.',
    type: McqTraining 
  })
  @ApiResponse({ status: 404, description: 'Question not found' })
  update(@Param('id') id: string, @Body() updateMcqTrainingDto: UpdateMcqTrainingDto) {
    return this.mcqTrainingService.update(id, updateMcqTrainingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an MCQ question (Admin)' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The MCQ question has been successfully deleted.',
    type: McqTraining 
  })
  @ApiResponse({ status: 404, description: 'Question not found' })
  remove(@Param('id') id: string) {
    return this.mcqTrainingService.remove(id);
  }
}
