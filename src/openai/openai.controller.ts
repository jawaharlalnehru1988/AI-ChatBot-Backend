import { Controller, Get, Post, Body, Patch, Param, Delete, Sse, MessageEvent, Options, Res, HttpStatus } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Options('*')
  handleOptions(@Res() res: Response) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(HttpStatus.OK);
  }

  @Post('chatCompletion')
  @Sse()
  async createChatCompletion(
    @Body() createOpenaiDto: CreateOpenaiDto): Promise<Observable<MessageEvent>> {
    return new Observable((subscriber) => {
      (async () => {
        try {
          for await (const chunk of this.openaiService.createStreamingChatCompletion(createOpenaiDto)) {
            subscriber.next({
              data: JSON.stringify(chunk),
              type: chunk.isComplete ? 'complete' : 'chunk'
            } as MessageEvent);
            
            if (chunk.isComplete) {
              subscriber.complete();
              break;
            }
          }
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }

  @Post('chatCompletion/simple')
  async createSimpleChatCompletion(
    @Body() createOpenaiDto: CreateOpenaiDto) {
    return this.openaiService.createChatCompletion(createOpenaiDto);
  }

  @Get('chatCompletion/stream/:sessionId')
  @Sse()
  streamChatCompletion(@Param('sessionId') sessionId: string): Observable<MessageEvent> {
    // This will be implemented with a session-based approach
    // Client first creates a session with POST, then connects to this SSE endpoint
    return new Observable((subscriber) => {
      subscriber.next({
        data: JSON.stringify({ message: 'Connected to stream', sessionId }),
        type: 'connected'
      } as MessageEvent);
    });
  }

  @Post('chatCompletion/stream/start')
  async startStreamingSession(@Body() createOpenaiDto: CreateOpenaiDto & { sessionId: string }) {
    const { sessionId, ...openaiDto } = createOpenaiDto;
    
    // Store the session and start streaming
    // For now, we'll return the session info
    return {
      sessionId,
      streamUrl: `/openai/chatCompletion/stream/${sessionId}`,
      message: 'Session created. Connect to streamUrl for real-time responses.',
    };
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
