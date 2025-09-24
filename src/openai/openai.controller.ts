import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chatCompletion')
  async createChatCompletion(
    @Body() createOpenaiDto: CreateOpenaiDto) {
    return this.openaiService.createChatCompletion(createOpenaiDto);
  }

  @Get()
  findAll() {
    return this.openaiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.openaiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpenaiDto: UpdateOpenaiDto) {
    return this.openaiService.update(+id, updateOpenaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.openaiService.remove(+id);
  }
}
