import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery 
} from '@nestjs/swagger';
import { AgenticAiService } from './agentic-ai.service';
import { CreateAgenticAiDto } from './dto/create-agentic-ai.dto';
import { UpdateAgenticAiDto } from './dto/update-agentic-ai.dto';
import { AgenticAi } from './entities/agentic-ai.entity';

@ApiTags('agentic-ai')
@Controller('agentic-ai')
export class AgenticAiController {
  constructor(private readonly agenticAiService: AgenticAiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agentic AI topic' })
  @ApiResponse({ 
    status: 201, 
    description: 'The agentic AI topic has been successfully created.',
    type: AgenticAi 
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createAgenticAiDto: CreateAgenticAiDto) {
    return this.agenticAiService.create(createAgenticAiDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agentic AI topics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return all agentic AI topics.',
    type: [AgenticAi] 
  })
  findAll() {
    return this.agenticAiService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search agentic AI topics' })
  @ApiQuery({ 
    name: 'q', 
    required: true, 
    description: 'Search query string',
    example: 'autonomous agents' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return matching agentic AI topics.',
    type: [AgenticAi] 
  })
  search(@Query('q') query: string) {
    return this.agenticAiService.search(query);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get agentic AI topics by category' })
  @ApiParam({ 
    name: 'category', 
    description: 'Category name',
    example: 'AI-Fundamentals' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return agentic AI topics for the specified category.',
    type: [AgenticAi] 
  })
  findByCategory(@Param('category') category: string) {
    return this.agenticAiService.findByCategory(category);
  }

  @Get('section/:sectionLink')
  @ApiOperation({ summary: 'Get an agentic AI topic by section link' })
  @ApiParam({ 
    name: 'sectionLink', 
    description: 'URL-friendly section link',
    example: 'introduction-to-ai-agents' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the agentic AI topic with the specified section link.',
    type: AgenticAi 
  })
  @ApiResponse({ status: 404, description: 'AgenticAi topic not found' })
  findBySectionLink(@Param('sectionLink') sectionLink: string) {
    return this.agenticAiService.findBySectionLink(sectionLink);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an agentic AI topic by ID' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Return the agentic AI topic with the specified ID.',
    type: AgenticAi 
  })
  @ApiResponse({ status: 404, description: 'AgenticAi topic not found' })
  findOne(@Param('id') id: string) {
    return this.agenticAiService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an agentic AI topic' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The agentic AI topic has been successfully updated.',
    type: AgenticAi 
  })
  @ApiResponse({ status: 404, description: 'AgenticAi topic not found' })
  update(@Param('id') id: string, @Body() updateAgenticAiDto: UpdateAgenticAiDto) {
    return this.agenticAiService.update(id, updateAgenticAiDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agentic AI topic' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB Object ID',
    example: '507f1f77bcf86cd799439011' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'The agentic AI topic has been successfully deleted.',
    type: AgenticAi 
  })
  @ApiResponse({ status: 404, description: 'AgenticAi topic not found' })
  remove(@Param('id') id: string) {
    return this.agenticAiService.remove(id);
  }
}
