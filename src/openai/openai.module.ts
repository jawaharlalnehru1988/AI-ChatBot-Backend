import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import OpenAI from 'openai';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [OpenaiController],
  imports: [ConfigModule],
  providers: [OpenaiService,
    {
      provide: OpenAI, 
      useFactory: (configService: ConfigService) => {
        const openai = new OpenAI({
          apiKey: configService.getOrThrow('OPENAI_API_KEY'),
        });
        return openai;
      },
      inject: [ConfigService],
    }
  ],
})
export class OpenaiModule {}
