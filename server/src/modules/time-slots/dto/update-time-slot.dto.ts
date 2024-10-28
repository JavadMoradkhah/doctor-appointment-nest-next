import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTimeSlotDto } from './create-time-slot.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTimeSlotDto extends PartialType(
  OmitType(CreateTimeSlotDto, ['appointmentId']),
) {
  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;
}
