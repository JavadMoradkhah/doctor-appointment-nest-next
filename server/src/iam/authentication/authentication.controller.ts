import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { AuthenticationService } from './authentication.service';
import { SendOtpDto } from './dto/send-otp.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Req() request: Request, @Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(request, sendOtpDto);
  }

}
