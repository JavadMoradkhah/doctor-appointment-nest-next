import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;
}
