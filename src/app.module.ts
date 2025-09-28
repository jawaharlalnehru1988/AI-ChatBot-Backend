import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { LivekitModule } from './livekit/livekit.module';
import { StreamingModule } from './streaming/streaming.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OpenaiModule,
    LivekitModule,
    StreamingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
