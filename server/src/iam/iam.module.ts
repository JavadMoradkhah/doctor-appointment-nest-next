import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QUEUE_OTP_SMS } from 'src/iam/iam.constants';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import accessTokenConfig from './config/access-token.config';
import refreshTokenConfig from './config/refresh-token.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { SmsQueueConsumer } from './iam.process';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    BullModule.registerQueue({ name: QUEUE_OTP_SMS }),
    JwtModule.registerAsync(accessTokenConfig.asProvider()),
    JwtModule.registerAsync(refreshTokenConfig.asProvider()),
    ConfigModule.forFeature(accessTokenConfig),
    ConfigModule.forFeature(refreshTokenConfig),
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
