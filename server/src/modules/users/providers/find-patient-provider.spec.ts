import { Test, TestingModule } from '@nestjs/testing';
import { FindPatientProvider } from './find-patient-provider';

describe('FindPatientProvider', () => {
  let provider: FindPatientProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindPatientProvider],
    }).compile();

    provider = module.get<FindPatientProvider>(FindPatientProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
