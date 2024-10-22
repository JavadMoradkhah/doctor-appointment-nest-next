import { Test, TestingModule } from '@nestjs/testing';
import { FindUserProvider } from './find-user-provider';

describe('FindUserProvider', () => {
  let provider: FindUserProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindUserProvider],
    }).compile();

    provider = module.get<FindUserProvider>(FindUserProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
