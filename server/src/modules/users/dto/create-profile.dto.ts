import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { UserGender } from '../enums/user-gender.enum';

export class CreateProfileDto {
  @IsString()
  @Length(3, 50)
  firstName: string;

  @IsString()
  @Length(3, 50)
  lastName: string;

  @IsString()
  @Length(10, 10)
  @IsNumberString()
  nationCode: string;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsString()
  @IsDateString()
  dateOfBirth: Date;
}
