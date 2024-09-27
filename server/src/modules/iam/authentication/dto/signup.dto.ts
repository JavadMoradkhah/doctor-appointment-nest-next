import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { UserGender } from 'src/modules/users/enums/user-gender.enum';
import {
  ERR_MSG_INVALID_PHONE,
  REGEX_PHONE,
} from '../authentication.constants';

export class SignUpDto {
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsString()
  @Length(11, 11)
  @Matches(REGEX_PHONE, { message: ERR_MSG_INVALID_PHONE })
  phone: string;

  @IsNumberString()
  @Length(6, 6)
  otp: string;

  @IsString()
  @Length(10, 10)
  @IsNumberString()
  nationCode: string;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsString()
  @IsDateString()
  dateOfBirth: string;
}
