import { Test, TestingModule } from '@nestjs/testing';
import { ClinicsAdminController } from './clinics-admin.controller';

describe('ClinicsAdminController', () => {
  let controller: ClinicsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicsAdminController],
    }).compile();

    controller = module.get<ClinicsAdminController>(ClinicsAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
