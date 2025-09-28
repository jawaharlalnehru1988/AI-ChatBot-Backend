import { Injectable } from '@nestjs/common';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  constructor(private readonly openai: OpenAI) {}
  
  async createChatCompletion(createOpenaiDto: CreateOpenaiDto) {
    const messages = createOpenaiDto.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      ...(msg.name && { name: msg.name })
    }));
    const response = await this.openai.chat.completions.create({
      messages: messages,
      model: 'gpt-4o-mini', // Cheaper alternative
    });
    return response;
  }

  async *createStreamingChatCompletion(createOpenaiDto: CreateOpenaiDto) {
    const messages = createOpenaiDto.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      ...(msg.name && { name: msg.name })
    }));
    
    const stream = await this.openai.chat.completions.create({
      messages: messages,
      model: 'gpt-4o-mini',
      stream: true, // Enable streaming
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield {
          content,
          timestamp: new Date().toISOString(),
          isComplete: false,
        };
      }
    }
    
    // Send completion signal
    yield {
      content: '',
      timestamp: new Date().toISOString(),
      isComplete: true,
    };
  }

  findAll() {
    return `This action returns all openai`;
  }

  findOne(id: number) {
    return `This action returns a #${id} openai`;
  }

  update(id: number, updateOpenaiDto: UpdateOpenaiDto) {
    return `This action updates a #${id} openai`;
  }

  remove(id: number) {
    return `This action removes a #${id} openai`;
  }
}
