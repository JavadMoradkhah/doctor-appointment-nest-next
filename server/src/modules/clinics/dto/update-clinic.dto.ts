import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateClinicDto } from './create-clinic.dto';

export class UpdateClinicDto extends PartialType(
  OmitType(CreateClinicDto, ['telephones']),
) {}
