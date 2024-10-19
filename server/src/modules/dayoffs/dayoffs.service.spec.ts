import { Test, TestingModule } from '@nestjs/testing';
import { DayOffsService } from './dayoffs.service';

describe('DayOffsService', () => {
  let service: DayOffsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayOffsService],
    }).compile();

    service = module.get<DayOffsService>(DayOffsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
