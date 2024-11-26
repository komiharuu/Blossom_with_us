import { Test, TestingModule } from '@nestjs/testing';
import { SerizesService } from './serizes.service';

describe('SerizesService', () => {
  let service: SerizesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SerizesService],
    }).compile();

    service = module.get<SerizesService>(SerizesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
