import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QUEUE_OTP_SMS } from 'src/modules/iam/iam.constants';
import { User } from 'src/modules/users/entities/user.entity';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import accessTokenConfig from './config/access-token.config';
import refreshTokenConfig from './config/refresh-token.config';
import { BcryptService } from './hashing/bcrypt.service';
import { HashingService } from './hashing/hashing.service';
import { SmsQueueConsumer } from './iam.process';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { RefreshTokenIdsStorage } from './authentication/storages/refresh-token-ids.storage';
import { OtpStorage } from './authentication/storages/otp.storage';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './authorization/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    SmsQueueConsumer,
    OtpStorage,
    RefreshTokenIdsStorage,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
