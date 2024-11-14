import { PartialType } from '@nestjs/swagger';
import { CreateClinicTelephoneDto } from './create-clinic-telephone.dto';

export class UpdateClinicTelephoneDto extends PartialType(
  CreateClinicTelephoneDto,
) {}
