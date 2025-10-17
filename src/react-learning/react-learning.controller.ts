import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReactLearningService } from './react-learning.service';
import { CreateReactLearningDto } from './dto/create-react-learning.dto';
import { UpdateReactLearningDto } from './dto/update-react-learning.dto';
import { ReactLearning } from './entities/react-learning.entity';

@ApiTags('react-learning')
@Controller('react-learning')
export class ReactLearningController {
  constructor(private readonly reactLearningService: ReactLearningService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new React learning section' })
  @ApiResponse({ 
    status: 201, 
    description: 'The section has been successfully created.',
    type: ReactLearning 
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createReactLearningDto: CreateReactLearningDto) {
    return this.reactLearningService.create(createReactLearningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all React learning sections' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all learning sections.',
    type: [ReactLearning] 
  })
  findAll() {
    return this.reactLearningService.findAll();
  }

  @Get('level/:level')
  @ApiOperation({ summary: 'Get sections by difficulty level' })
  @ApiParam({ 
    name: 'level', 
    description: 'Difficulty level',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    example: 'Beginner' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return sections for the specified level.',
    type: [ReactLearning] 
  })
  findByLevel(@Param('level') level: string) {
    return this.reactLearningService.findByLevel(level);
  }

  @Get('level/:level/stats')
  @ApiOperation({ summary: 'Get statistics for a difficulty level' })
  @ApiParam({ 
    name: 'level', 
    description: 'Difficulty level',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    example: 'Beginner' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return statistics for the level including progress.'
  })
  getLevelStats(@Param('level') level: string) {
    return this.reactLearningService.getLevelStatistics(level);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a section by MongoDB ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the section with the specified ID.',
    type: ReactLearning 
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  findOne(@Param('id') id: string) {
    return this.reactLearningService.findOne(id);
  }

  @Get(':id/with-topics')
  @ApiOperation({ summary: 'Get a section by MongoDB ID with full topic details' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the section with full topic details populated.'
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  findOneWithTopics(@Param('id') id: string) {
    return this.reactLearningService.findOneWithTopics(id);
  }

  @Get(':id/topics')
  @ApiOperation({ summary: 'Get all topic references in a section' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all topic IDs (use /react-topics endpoint to get full topic details).'
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  getTopics(@Param('id') id: string) {
    return this.reactLearningService.getTopics(id);
  }

  @Post(':id/topics/:topicId')
  @ApiOperation({ summary: 'Add a topic to a section' })
  @ApiParam({ 
    name: 'id', 
    description: 'Section MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiParam({ 
    name: 'topicId', 
    description: 'Topic MongoDB Object ID',
    example: '507f1f77bcf86cd799439012' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Topic added to section.',
    type: ReactLearning 
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  addTopicToSection(@Param('id') id: string, @Param('topicId') topicId: string) {
    return this.reactLearningService.addTopicToSection(id, topicId);
  }

  @Delete(':id/topics/:topicId')
  @ApiOperation({ summary: 'Remove a topic from a section' })
  @ApiParam({ 
    name: 'id', 
    description: 'Section MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiParam({ 
    name: 'topicId', 
    description: 'Topic MongoDB Object ID',
    example: '507f1f77bcf86cd799439012' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Topic removed from section.',
    type: ReactLearning 
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  removeTopicFromSection(@Param('id') id: string, @Param('topicId') topicId: string) {
    return this.reactLearningService.removeTopicFromSection(id, topicId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a learning section' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The section has been successfully updated.',
    type: ReactLearning 
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  update(@Param('id') id: string, @Body() updateReactLearningDto: UpdateReactLearningDto) {
    return this.reactLearningService.update(id, updateReactLearningDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a learning section' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The section has been successfully deleted.',
    type: ReactLearning 
  })
  @ApiResponse({ status: 404, description: 'Section not found' })
  remove(@Param('id') id: string) {
    return this.reactLearningService.remove(id);
  }
}
