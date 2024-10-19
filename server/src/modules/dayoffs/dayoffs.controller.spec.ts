import { Test, TestingModule } from '@nestjs/testing';
import { DayOffsController } from './dayoffs.controller';
import { DayOffsService } from './dayoffs.service';

describe('DayOffsController', () => {
  let controller: DayOffsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayOffsController],
      providers: [DayOffsService],
    }).compile();

    controller = module.get<DayOffsController>(DayOffsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
