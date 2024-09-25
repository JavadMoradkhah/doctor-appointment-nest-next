import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import refreshTokenConfig from '../config/refresh-token.config';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  MSG_YOU_HAVE_SUCCESSFULLY_LOGGED_IN,
} from './authentication.constants';
import { AuthenticationService } from './authentication.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import accessTokenConfig from '../config/access-token.config';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
@Auth(AuthType.None)
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    @Inject(refreshTokenConfig.KEY)
    private readonly refreshTokenConfiguration: ConfigType<
      typeof refreshTokenConfig
    >,
    @Inject(accessTokenConfig.KEY)
    private readonly accessTokenConfiguration: ConfigType<
      typeof accessTokenConfig
    >,
  ) {}

  @Post('otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.verifyOtp(verifyOtpDto);

    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + this.accessTokenConfiguration.ttl * 1000),
    });

    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + this.refreshTokenConfiguration.ttl * 1000),
    });

    return { message: MSG_YOU_HAVE_SUCCESSFULLY_LOGGED_IN };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.refreshTokens(req);

    res.cookie(COOKIE_ACCESS_TOKEN, accessToken, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + this.accessTokenConfiguration.ttl * 1000),
    });

    res.cookie(COOKIE_REFRESH_TOKEN, refreshToken, {
      signed: true,
      httpOnly: true,
      expires: new Date(Date.now() + this.refreshTokenConfiguration.ttl * 1000),
    });
  }
}
