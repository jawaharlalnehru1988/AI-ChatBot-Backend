import { Module } from '@nestjs/common';
import { StreamingGateway } from './streaming.gateway';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [OpenaiModule],
  providers: [StreamingGateway],
  exports: [StreamingGateway],
})
export class StreamingModule {}