import { Test, TestingModule } from '@nestjs/testing';
import { AgenticAiController } from './agentic-ai.controller';
import { AgenticAiService } from './agentic-ai.service';

describe('AgenticAiController', () => {
  let controller: AgenticAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenticAiController],
      providers: [AgenticAiService],
    }).compile();

    controller = module.get<AgenticAiController>(AgenticAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
