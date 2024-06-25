import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  private getKey(userId: string): string {
    return `user:${userId}:token`;
  }

  async insert(userId: string, tokenId: string): Promise<void> {
    await this.redis.set(this.getKey(userId), tokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    const storedTokenId = await this.redis.get(this.getKey(userId));
    return storedTokenId === tokenId;
  }

  async invalidate(userId: string): Promise<void> {
    await this.redis.del(this.getKey(userId));
  }
}
