import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateClinicAddressDto } from './create-clinic-address.dto';
import { CreateClinicTelephoneDto } from './create-clinic-telephone.dto';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  introduction: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateClinicAddressDto)
  address: CreateClinicAddressDto;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @Type(() => CreateClinicTelephoneDto)
  @ValidateNested({ each: true })
  telephones: CreateClinicTelephoneDto[];
}
