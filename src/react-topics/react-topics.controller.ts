import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReactTopicsService } from './react-topics.service';
import { CreateReactTopicDto } from './dto/create-react-topic.dto';
import { UpdateReactTopicDto } from './dto/update-react-topic.dto';
import { ReactTopic } from './entities/react-topic.entity';

@ApiTags('react-topics')
@Controller('react-topics')
export class ReactTopicsController {
  constructor(private readonly reactTopicsService: ReactTopicsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new React topic' })
  @ApiResponse({ 
    status: 201, 
    description: 'The topic has been successfully created.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createReactTopicDto: CreateReactTopicDto) {
    return this.reactTopicsService.create(createReactTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all React topics or filter by section' })
  @ApiQuery({ 
    name: 'sectionId', 
    required: false, 
    description: 'Filter topics by section MongoDB ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all topics or filtered by section.',
    type: [ReactTopic] 
  })
  findAll(@Query('sectionId') sectionId?: string) {
    if (sectionId) {
      return this.reactTopicsService.findBySection(sectionId);
    }
    return this.reactTopicsService.findAll();
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Get a topic by topicId' })
  @ApiParam({ 
    name: 'topicId', 
    description: 'Topic identifier',
    example: 'what-is-react' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the topic with the specified topicId.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findByTopicId(@Param('topicId') topicId: string) {
    return this.reactTopicsService.findByTopicId(topicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a topic by MongoDB ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the topic with the specified ID.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  findOne(@Param('id') id: string) {
    return this.reactTopicsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a React topic' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The topic has been successfully updated.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  update(@Param('id') id: string, @Body() updateReactTopicDto: UpdateReactTopicDto) {
    return this.reactTopicsService.update(id, updateReactTopicDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a topic as completed' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Topic marked as completed.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  markAsCompleted(@Param('id') id: string) {
    return this.reactTopicsService.markAsCompleted(id);
  }

  @Patch(':id/incomplete')
  @ApiOperation({ summary: 'Mark a topic as incomplete' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Topic marked as incomplete.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  markAsIncomplete(@Param('id') id: string) {
    return this.reactTopicsService.markAsIncomplete(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a React topic' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The topic has been successfully deleted.',
    type: ReactTopic 
  })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  remove(@Param('id') id: string) {
    return this.reactTopicsService.remove(id);
  }
}
