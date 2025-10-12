import { Test, TestingModule } from '@nestjs/testing';
import { McqTrainingService } from './mcq-training.service';

describe('McqTrainingService', () => {
  let service: McqTrainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McqTrainingService],
    }).compile();

    service = module.get<McqTrainingService>(McqTrainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
