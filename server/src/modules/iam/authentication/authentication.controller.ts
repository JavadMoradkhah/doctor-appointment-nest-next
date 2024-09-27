import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import accessTokenConfig from '../config/access-token.config';
import refreshTokenConfig from '../config/refresh-token.config';
import {
  COOKIE_ACCESS_TOKEN,
  COOKIE_REFRESH_TOKEN,
  MSG_YOU_HAVE_SUCCESSFULLY_LOGGED_IN,
  MSG_YOU_HAVE_SUCCESSFULLY_SIGNED_UP,
} from './authentication.constants';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthType } from './enums/auth-type.enum';

@ApiTags('auth')
@Controller('auth')
// @UseGuards(ThrottlerGuard)
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

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

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signUp(signUpDto);

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

    return { message: MSG_YOU_HAVE_SUCCESSFULLY_SIGNED_UP };
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
