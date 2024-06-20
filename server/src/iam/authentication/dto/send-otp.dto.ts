import { IsString, Length, Matches } from 'class-validator';
import {
  ERR_MSG_INVALID_PHONE,
  REGEX_PHONE,
} from '../authentication.constants';

export class SendOtpDto {
  @IsString()
  @Length(11, 11)
  @Matches(REGEX_PHONE, { message: ERR_MSG_INVALID_PHONE })
  phone: string;
}