import { Test, TestingModule } from '@nestjs/testing';
import { SerizesController } from './serizes.controller';
import { SerizesService } from './serizes.service';

describe('SerizesController', () => {
  let controller: SerizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SerizesController],
      providers: [SerizesService],
    }).compile();

    controller = module.get<SerizesController>(SerizesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
