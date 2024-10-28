import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';

export class CreateTimeSlotDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  appointmentId: number;

  @IsString()
  @IsTime()
  @IsNotEmpty()
  time: string;
}
