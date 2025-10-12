import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { McqTrainingService } from './mcq-training.service';
import { McqTrainingController } from './mcq-training.controller';
import { McqTraining, McqTrainingSchema } from './entities/mcq-training.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: McqTraining.name, schema: McqTrainingSchema },
    ]),
  ],
  controllers: [McqTrainingController],
  providers: [McqTrainingService],
  exports: [McqTrainingService],
})
export class McqTrainingModule {}
