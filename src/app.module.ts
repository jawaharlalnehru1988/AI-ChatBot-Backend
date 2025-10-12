import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemdesignModule } from './systemdesign/systemdesign.module';
import { AgenticAiModule } from './agentic-ai/agentic-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://nehru00123:Soundarya1994@harekrishna.iaouzqs.mongodb.net/asknehru'),
    SystemdesignModule,
    AgenticAiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
