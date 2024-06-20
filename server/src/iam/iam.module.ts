import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QUEUE_OTP_SMS } from 'src/iam/iam.constants';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { Otp } from './authentication/entities/otp.entity';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { SmsQueueConsumer } from './iam.process';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    BullModule.registerQueue({ name: QUEUE_OTP_SMS }),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    SmsQueueConsumer,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
