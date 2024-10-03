import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { IPostgresInterval } from 'postgres-interval';
import { ERR_MSG_INVALID_TIME } from 'src/common/constants/datetime.constants';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MaxTime } from 'src/common/decorators/datetime/max-time.decorator';
import { MinTime } from 'src/common/decorators/datetime/min-time.decorator';
import {
  ERR_MSG_APPOINTMENTS_GAP_MAX_TIME,
  ERR_MSG_APPOINTMENTS_GAP_MIN_TIME,
} from '../doctors.constants';

export class CreateDoctorDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  specializationId: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  degreeId: number;

  @IsString()
  @IsNotEmpty()
  @Length(20, 512)
  biography: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  avatar?: any;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTime(
    { hours: 0, minutes: 5, seconds: 0 },
    { message: ERR_MSG_APPOINTMENTS_GAP_MIN_TIME },
  )
  @MaxTime(
    { hours: 1, minutes: 0, seconds: 0 },
    { message: ERR_MSG_APPOINTMENTS_GAP_MAX_TIME },
  )
  defaultAppointmentsGap: IPostgresInterval;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[0-9]{5}$/)
  medicalSystemNumber: string;
}
