import { Test, TestingModule } from '@nestjs/testing';
import { AgenticAiService } from './agentic-ai.service';

describe('AgenticAiService', () => {
  let service: AgenticAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgenticAiService],
    }).compile();

    service = module.get<AgenticAiService>(AgenticAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
