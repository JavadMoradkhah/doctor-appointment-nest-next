import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { HashingService } from 'src/modules/iam/hashing/hashing.service';

@Injectable()
export class OtpStorage {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly hashingService: HashingService,
  ) {}

  private getKey(phone: string): string {
    return `otp:${phone}`;
  }

  generateOtp(): string {
    const min = 111111;
    const max = 999999;
    const otp = Math.floor(Math.random() * (max - min) + 1) + min;
    return otp.toString();
  }

  async getOtp(phone: string): Promise<string | null> {
    return (await this.redis.get(this.getKey(phone))) || null;
  }

  async save(
    phone: string,
    otpCode: string,
    expiration = 5 * 60,
  ): Promise<boolean> {
    const key = this.getKey(phone);
    const hashedOtp = await this.hashingService.hash(otpCode);
    const result = await this.redis.set(key, hashedOtp, 'EX', expiration);
    return result === 'OK';
  }

  verify(otpCode: string, hashedOtpCode: string): Promise<boolean> {
    return this.hashingService.compare(otpCode, hashedOtpCode);
  }

  async remove(phone: string): Promise<void> {
    await this.redis.del(this.getKey(phone));
  }
}
