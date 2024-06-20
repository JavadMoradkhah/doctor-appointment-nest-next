import { InjectQueue } from '@nestjs/bull';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Request } from 'express';
import randomCodeGenerator from 'src/common/utils/random-code-generator.util';
import { JOB_OTP_SMS, QUEUE_OTP_SMS } from 'src/iam/iam.constants';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { Otp } from './entities/otp.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
    private readonly hashingService: HashingService,
    @InjectQueue(QUEUE_OTP_SMS)
    private readonly smsQueue: Queue,
  ) {}

  async sendOtp(request: Request, sendOtpDto: SendOtpDto) {
    const otpCode = randomCodeGenerator(111111, 999999);

    const job = await this.smsQueue.add(JOB_OTP_SMS, {
      phone: sendOtpDto.phone,
      otp: otpCode,
    });

    const hashedOtp = await this.hashingService.hash(otpCode.toString());

    await this.otpRepo.save(
      this.otpRepo.create({
        phone: sendOtpDto.phone,
        otp: hashedOtp,
        ip: request.ip,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      }),
    );
  }

  }
