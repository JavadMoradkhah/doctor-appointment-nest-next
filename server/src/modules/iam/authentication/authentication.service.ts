import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Request } from 'express';
import { TooManyRequestsException } from 'src/common/exceptions/too-many-requests.exception';
import { JOB_OTP_SMS, QUEUE_OTP_SMS } from 'src/modules/iam/iam.constants';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { User } from '../../users/entities/user.entity';
import accessTokenConfig from '../config/access-token.config';
import refreshTokenConfig from '../config/refresh-token.config';
import { OtpSms } from '../interfaces/jobs/otp-sms.job';
import {
  COOKIE_REFRESH_TOKEN,
  ERR_MSG_ACCOUNT_DOES_NOT_EXIST,
  ERR_MSG_ACCOUNT_IS_INACTIVE,
  ERR_MSG_INVALID_OTP,
  ERR_MSG_INVALID_TOKEN,
  ERR_MSG_LOGIN_REQUIRED,
  ERR_MSG_NATIONAL_CODE_UNIQUENESS_VIOLATION,
  ERR_MSG_OTP_HAS_NOT_BEEN_SENT_OR_EXPIRED,
  ERR_MSG_OTP_HAS_NOT_EXPIRED_YET,
  ERR_MSG_TOKEN_EXPIRED,
  ERR_MSG_YOU_ALREADY_SIGNED_UP,
  ERR_MSG_YOU_DO_NOT_HAVE_AN_ACCOUNT,
} from './authentication.constants';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { SignUpDto } from './dto/signup.dto';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload.interface';
import { OtpStorage } from './storages/otp.storage';
import { RefreshTokenIdsStorage } from './storages/refresh-token-ids.storage';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly otpStorage: OtpStorage,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    @InjectQueue(QUEUE_OTP_SMS)
    private readonly smsQueue: Queue<OtpSms>,
    private readonly jwtService: JwtService,
    @Inject(accessTokenConfig.KEY)
    private readonly accessTokenConfiguration: ConfigType<
      typeof accessTokenConfig
    >,
    @Inject(refreshTokenConfig.KEY)
    private readonly refreshTokenConfiguration: ConfigType<
      typeof refreshTokenConfig
    >,
  ) {}

  async sendOtp({ phone }: SendOtpDto) {
    const otpInCache = await this.otpStorage.getOtp(phone);

    if (otpInCache) {
      throw new TooManyRequestsException(ERR_MSG_OTP_HAS_NOT_EXPIRED_YET);
    }

    const otpCode = this.otpStorage.generateOtp();

    await this.otpStorage.save(phone, otpCode);

    await this.smsQueue.add(JOB_OTP_SMS, {
      phone: phone,
      otp: otpCode,
    });
  }

  async login({ phone, otp }: LoginDto) {
    await this.verifyOtp(phone, otp);

    const user = await this.usersRepo.findOneBy({ phone: phone });

    if (!user) {
      throw new BadRequestException(ERR_MSG_YOU_DO_NOT_HAVE_AN_ACCOUNT);
    }

    if (!user.isActive) {
      throw new ForbiddenException(ERR_MSG_ACCOUNT_IS_INACTIVE);
    }

    const tokens = await this.generateTokens(user);

    // Remove the verified OTP from redis
    await this.otpStorage.remove(phone);

    return tokens;
  }

  async signUp(signUpDto: SignUpDto) {
    await this.verifyOtp(signUpDto.phone, signUpDto.otp);

    const userExists = await this.usersRepo.existsBy({
      phone: signUpDto.phone,
    });

    if (userExists) {
      throw new ConflictException(ERR_MSG_YOU_ALREADY_SIGNED_UP);
    }

    const nationCodeExists = await this.usersRepo.existsBy({
      nationCode: signUpDto.nationCode,
    });

    if (nationCodeExists) {
      throw new ConflictException(ERR_MSG_NATIONAL_CODE_UNIQUENESS_VIOLATION);
    }

    const user = await this.usersRepo.save(
      this.usersRepo.create({
        firstName: signUpDto.firstName,
        lastName: signUpDto.lastName,
        phone: signUpDto.phone,
        gender: signUpDto.gender,
        dateOfBirth: signUpDto.dateOfBirth,
        nationCode: signUpDto.nationCode,
      }),
    );

    const tokens = await this.generateTokens(user);

    // Remove the verified OTP from redis
    await this.otpStorage.remove(signUpDto.phone);

    return tokens;
  }

  async refreshTokens(request: Request) {
    const refreshToken = request.signedCookies[COOKIE_REFRESH_TOKEN];

    if (!refreshToken) {
      throw new UnauthorizedException(ERR_MSG_LOGIN_REQUIRED);
    }

    try {
      const { sub, refreshTokenId } =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
          secret: this.refreshTokenConfiguration.secret,
          audience: this.refreshTokenConfiguration.audience,
          issuer: this.refreshTokenConfiguration.issuer,
        });

      const user = await this.usersRepo.findOneBy({ id: sub });

      if (!user) {
        throw new UnauthorizedException(ERR_MSG_ACCOUNT_DOES_NOT_EXIST);
      }

      if (!user.isActive) {
        throw new ForbiddenException(ERR_MSG_ACCOUNT_IS_INACTIVE);
      }

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (!isValid) {
        throw new UnauthorizedException(ERR_MSG_INVALID_TOKEN);
      }

      await this.refreshTokenIdsStorage.invalidate(user.id);

      return await this.generateTokens(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException(ERR_MSG_TOKEN_EXPIRED);
        } else {
          throw new UnauthorizedException(ERR_MSG_INVALID_TOKEN);
        }
      } else {
        throw error;
      }
    }
  }

  private async verifyOtp(phone: string, otp: string) {
    const otpInCache = await this.otpStorage.getOtp(phone);

    if (!otpInCache) {
      throw new UnauthorizedException(ERR_MSG_OTP_HAS_NOT_BEEN_SENT_OR_EXPIRED);
    }

    const otpIsValid = await this.otpStorage.verify(otp, otpInCache);

    if (!otpIsValid) {
      throw new UnauthorizedException(ERR_MSG_INVALID_OTP);
    }
  }

  private signToken<T>(
    userId: number,
    signOptions: {
      expiresIn: number;
      secret: string;
    },
    payload?: T,
  ) {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        /*
          WARNING: audience and issuer properties are the same for access and refresh tokens.
          If you are planning to change those properties for access and refresh tokens,
          remember that you have to change them here as well.
        */
        audience: this.accessTokenConfiguration.audience,
        issuer: this.accessTokenConfiguration.issuer,
        /*
          NOTE: Remember that, secret and expiresIn properties
          are different for access tokens and refresh tokens
        */
        secret: signOptions.secret,
        expiresIn: signOptions.expiresIn,
      },
    );
  }

  private async generateTokens(user: User) {
    const refreshTokenId = ulid();

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<AccessTokenPayload>(
        user.id,
        {
          expiresIn: this.accessTokenConfiguration.ttl,
          secret: this.accessTokenConfiguration.secret,
        },
        { role: user.role },
      ),
      this.signToken<RefreshTokenPayload>(
        user.id,
        {
          expiresIn: this.refreshTokenConfiguration.ttl,
          secret: this.refreshTokenConfiguration.secret,
        },
        { refreshTokenId },
      ),
    ]);

    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    return { accessToken, refreshToken };
  }
}
