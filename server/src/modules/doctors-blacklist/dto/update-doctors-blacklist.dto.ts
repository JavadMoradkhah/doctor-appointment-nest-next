import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDoctorsBlacklistDto } from './create-doctors-blacklist.dto';

export class UpdateDoctorsBlacklistDto extends PartialType(
  OmitType(CreateDoctorsBlacklistDto, ['patientId']),
) {}
