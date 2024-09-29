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

export class CreateDoctorDto {
  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

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
  @Matches(/^([0-9]{2}:){2}[0-9]{2}$/)
  defaultAppointmentsGap: IPostgresInterval;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[0-9]{5}$/)
  medicalSystemNumber: string;
}
