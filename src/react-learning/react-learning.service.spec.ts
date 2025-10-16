import { Test, TestingModule } from '@nestjs/testing';
import { ReactLearningService } from './react-learning.service';

describe('ReactLearningService', () => {
  let service: ReactLearningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactLearningService],
    }).compile();

    service = module.get<ReactLearningService>(ReactLearningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
