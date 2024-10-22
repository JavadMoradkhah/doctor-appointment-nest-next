import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinDate,
} from 'class-validator';
import { ERR_MSG_DOCTORS_BLACKLIST_MIN_EXPIRATION_TIME } from '../doctors-blacklist.constants';
import { Type } from 'class-transformer';

export class CreateDoctorsBlacklistDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  patientId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  notes: string;

  @IsDate()
  @IsOptional()
  @MinDate(() => new Date(Date.now() + 1 * 60 * 60 * 1000), {
    message: ERR_MSG_DOCTORS_BLACKLIST_MIN_EXPIRATION_TIME,
  })
  @Type(() => Date)
  expiresAt!: Date;
}
