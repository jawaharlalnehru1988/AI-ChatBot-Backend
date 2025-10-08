import { Test, TestingModule } from '@nestjs/testing';
import { SystemdesignController } from './systemdesign.controller';
import { SystemdesignService } from './systemdesign.service';

describe('SystemdesignController', () => {
  let controller: SystemdesignController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemdesignController],
      providers: [SystemdesignService],
    }).compile();

    controller = module.get<SystemdesignController>(SystemdesignController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
