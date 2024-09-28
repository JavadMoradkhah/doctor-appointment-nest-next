import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateDegreeDto } from './create-degree.dto';

export class CreateManyDegreesDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDegreeDto)
  degrees: CreateDegreeDto[];
}
