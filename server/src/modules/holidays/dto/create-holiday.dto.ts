import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;
}
