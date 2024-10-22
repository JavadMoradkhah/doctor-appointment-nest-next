import { Test, TestingModule } from '@nestjs/testing';
import { DoctorsBlacklistController } from './doctors-blacklist.controller';
import { DoctorsBlacklistService } from './doctors-blacklist.service';

describe('DoctorsBlacklistController', () => {
  let controller: DoctorsBlacklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorsBlacklistController],
      providers: [DoctorsBlacklistService],
    }).compile();

    controller = module.get<DoctorsBlacklistController>(
      DoctorsBlacklistController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
