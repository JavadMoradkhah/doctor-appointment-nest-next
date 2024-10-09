import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateHolidayDto } from './create-holiday.dto';

export class CreateManyHolidaysDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateHolidayDto)
  holidays: CreateHolidayDto[];
}
