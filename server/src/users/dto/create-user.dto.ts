import { IsEnum, IsString, Length, Matches } from 'class-validator';
import {
  ERR_MSG_INVALID_PHONE,
  REGEX_PHONE,
} from 'src/iam/authentication/authentication.constants';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsString()
  @Length(11, 11)
  @Matches(REGEX_PHONE, { message: ERR_MSG_INVALID_PHONE })
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;
}
