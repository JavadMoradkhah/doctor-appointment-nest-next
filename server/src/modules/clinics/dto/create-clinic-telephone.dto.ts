import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ERR_MSG_INVALID_TELEPHONE } from '../clinics.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClinicTelephoneDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Matches(/^0[0-9]{10}$/, { message: ERR_MSG_INVALID_TELEPHONE })
  @ApiProperty({ example: '02122334455' })
  telephone: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  description: string;
}
