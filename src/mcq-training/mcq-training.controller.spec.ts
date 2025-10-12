import { Test, TestingModule } from '@nestjs/testing';
import { McqTrainingController } from './mcq-training.controller';
import { McqTrainingService } from './mcq-training.service';

describe('McqTrainingController', () => {
  let controller: McqTrainingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [McqTrainingController],
      providers: [McqTrainingService],
    }).compile();

    controller = module.get<McqTrainingController>(McqTrainingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
