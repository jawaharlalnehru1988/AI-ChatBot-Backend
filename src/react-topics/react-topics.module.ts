import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactTopicsService } from './react-topics.service';
import { ReactTopicsController } from './react-topics.controller';
import { ReactTopic, ReactTopicSchema } from './entities/react-topic.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReactTopic.name, schema: ReactTopicSchema },
    ]),
  ],
  controllers: [ReactTopicsController],
  providers: [ReactTopicsService],
  exports: [ReactTopicsService],
})
export class ReactTopicsModule {}
