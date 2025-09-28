import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LivekitService } from './livekit.service';
import { LivekitController } from './livekit.controller';
import { AiLivekitService } from './ai-livekit.service';
import { AiLivekitController } from './ai-livekit.controller';
import { RealtimeChatService } from './realtime-chat.service';
import { RealtimeChatController } from './realtime-chat.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
  imports: [ConfigModule, OpenaiModule],
  controllers: [
    LivekitController, 
    AiLivekitController,
    RealtimeChatController,
  ],
  providers: [
    LivekitService, 
    AiLivekitService,
    RealtimeChatService,
  ],
  exports: [
    LivekitService, 
    AiLivekitService,
    RealtimeChatService,
  ],
})
export class LivekitModule {}