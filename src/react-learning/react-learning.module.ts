import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactLearningService } from './react-learning.service';
import { ReactLearningController } from './react-learning.controller';
import { ReactLearning, ReactLearningSchema } from './entities/react-learning.entity';
import { ReactTopicsModule } from '../react-topics/react-topics.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReactLearning.name, schema: ReactLearningSchema },
    ]),
    ReactTopicsModule,
  ],
  controllers: [ReactLearningController],
  providers: [ReactLearningService],
  exports: [ReactLearningService],
})
export class ReactLearningModule {}
