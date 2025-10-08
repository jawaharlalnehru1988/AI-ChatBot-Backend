import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { SystemdesignService } from './systemdesign.service';
import { CreateSystemdesignDto } from './dto/create-systemdesign.dto';
import { UpdateSystemdesignDto } from './dto/update-systemdesign.dto';
import { Systemdesign } from './entities/systemdesign.entity';

@ApiTags('systemdesign')
@Controller('systemdesign')
export class SystemdesignController {
  constructor(private readonly systemdesignService: SystemdesignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new system design topic' })
  @ApiBody({ type: CreateSystemdesignDto })
  @ApiResponse({ 
    status: 201, 
    description: 'System design topic created successfully',
    type: Systemdesign 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  async create(@Body() createSystemdesignDto: CreateSystemdesignDto) {
    try {
      return await this.systemdesignService.create(createSystemdesignDto);
    } catch (error) {
      throw new HttpException('Failed to create systemdesign', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all system design topics' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all system design topics',
    type: [Systemdesign] 
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      return await this.systemdesignService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch systemdesigns', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search system design topics by keyword' })
  @ApiQuery({ 
    name: 'q', 
    required: true, 
    description: 'Search query to find in title, description, category, or content',
    example: 'architecture'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of matching system design topics',
    type: [Systemdesign] 
  })
  @ApiResponse({ status: 400, description: 'Search query is required' })
  async search(@Query('q') query: string) {
    try {
      if (!query) {
        throw new HttpException('Search query is required', HttpStatus.BAD_REQUEST);
      }
      return await this.systemdesignService.search(query);
    } catch (error) {
      throw new HttpException('Failed to search systemdesigns', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get system design topics by category' })
  @ApiParam({ 
    name: 'category', 
    description: 'Category name to filter topics',
    example: 'High-Level-Design'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of system design topics in the specified category',
    type: [Systemdesign] 
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByCategory(@Param('category') category: string) {
    try {
      return await this.systemdesignService.findByCategory(category);
    } catch (error) {
      throw new HttpException('Failed to fetch systemdesigns by category', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('section/:sectionLink')
  @ApiOperation({ summary: 'Get system design topic by section link' })
  @ApiParam({ 
    name: 'sectionLink', 
    description: 'URL-friendly section link',
    example: 'from-requirements-to-architecture'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'System design topic found',
    type: Systemdesign 
  })
  @ApiResponse({ status: 404, description: 'System design topic not found' })
  async findBySectionLink(@Param('sectionLink') sectionLink: string) {
    try {
      return await this.systemdesignService.findBySectionLink(sectionLink);
    } catch (error) {
      throw new HttpException('Systemdesign not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get system design topic by MongoDB ObjectId' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the system design topic',
    example: '652e1a8e0000000000000001'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'System design topic found',
    type: Systemdesign 
  })
  @ApiResponse({ status: 404, description: 'System design topic not found' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.systemdesignService.findOne(id);
    } catch (error) {
      throw new HttpException('Systemdesign not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update system design topic by MongoDB ObjectId' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the system design topic',
    example: '652e1a8e0000000000000001'
  })
  @ApiBody({ type: UpdateSystemdesignDto })
  @ApiResponse({ 
    status: 200, 
    description: 'System design topic updated successfully',
    type: Systemdesign 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 404, description: 'System design topic not found' })
  async update(@Param('id') id: string, @Body() updateSystemdesignDto: UpdateSystemdesignDto) {
    try {
      return await this.systemdesignService.update(id, updateSystemdesignDto);
    } catch (error) {
      throw new HttpException('Failed to update systemdesign', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete system design topic by MongoDB ObjectId' })
  @ApiParam({ 
    name: 'id', 
    description: 'MongoDB ObjectId of the system design topic',
    example: '652e1a8e0000000000000001'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'System design topic deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Systemdesign deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'System design topic not found' })
  async remove(@Param('id') id: string) {
    try {
      await this.systemdesignService.remove(id);
      return { message: 'Systemdesign deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete systemdesign', HttpStatus.BAD_REQUEST);
    }
  }
}
