import { Test, TestingModule } from '@nestjs/testing';
import { SystemdesignService } from './systemdesign.service';

describe('SystemdesignService', () => {
  let service: SystemdesignService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemdesignService],
    }).compile();

    service = module.get<SystemdesignService>(SystemdesignService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
