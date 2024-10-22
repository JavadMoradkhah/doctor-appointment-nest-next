import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsBlacklistService } from './doctors-blacklist.service';

describe('DoctorsBlacklistService', () => {
  let service: DoctorsBlacklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorsBlacklistService],
    }).compile();

    service = module.get<DoctorsBlacklistService>(DoctorsBlacklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
