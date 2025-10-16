import { Test, TestingModule } from '@nestjs/testing';
import { ReactLearningController } from './react-learning.controller';
import { ReactLearningService } from './react-learning.service';

describe('ReactLearningController', () => {
  let controller: ReactLearningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactLearningController],
      providers: [ReactLearningService],
    }).compile();

    controller = module.get<ReactLearningController>(ReactLearningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
