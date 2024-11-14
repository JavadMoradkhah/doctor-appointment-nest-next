import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClinicAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  area: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  address: string;
}
