import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateSpecializationDto } from './create-specialization.dto';

export class CreateManySpecializationsDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecializationDto)
  specializations: CreateSpecializationDto[];
}
