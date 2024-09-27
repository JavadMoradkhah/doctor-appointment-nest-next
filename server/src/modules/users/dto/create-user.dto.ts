import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import {
  ERR_MSG_INVALID_PHONE,
  REGEX_PHONE,
} from 'src/modules/iam/authentication/authentication.constants';
import { UserGender } from '../enums/user-gender.enum';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(REGEX_PHONE, { message: ERR_MSG_INVALID_PHONE })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  @IsNumberString()
  nationCode: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsEnum(UserGender)
  @IsNotEmpty()
  gender: UserGender;

  @IsISO8601()
  @IsNotEmpty()
  dateOfBirth: Date;
}
