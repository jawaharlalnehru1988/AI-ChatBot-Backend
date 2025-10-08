import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenaiModule } from './openai/openai.module';
import { LivekitModule } from './livekit/livekit.module';
import { StreamingModule } from './streaming/streaming.module';
import { SystemdesignModule } from './systemdesign/systemdesign.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb+srv://nehru00123:Soundarya1994@harekrishna.iaouzqs.mongodb.net/asknehru'),
    OpenaiModule,
    LivekitModule,
    StreamingModule,
    SystemdesignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
