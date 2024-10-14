import { Test, TestingModule } from '@nestjs/testing';
import { FindDoctorProvider } from './find-doctor.provider';

describe('FindDoctorProvider', () => {
  let provider: FindDoctorProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindDoctorProvider],
    }).compile();

    provider = module.get<FindDoctorProvider>(FindDoctorProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
