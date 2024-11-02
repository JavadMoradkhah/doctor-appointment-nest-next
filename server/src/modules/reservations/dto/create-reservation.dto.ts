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
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';

export class CreateReservationDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  doctorId: number;

  @IsDate()
  @IsNotEmpty()
  @MinDate(() => new Date(Date.now()))
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsTime()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @IsTime()
  endTime: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  reason: string;
}
