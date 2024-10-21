import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { IsDateAfter } from 'src/common/decorators/datetime/is-date-after.decorator';
import { IsDateBefore } from 'src/common/decorators/datetime/is-date-before.decorator';
import { MaxDateDiff } from 'src/common/decorators/datetime/max-date-diff.decorator';
import { MinDateDiff } from 'src/common/decorators/datetime/min-date-diff.decorator';
import {
  ERR_MSG_APPOINTMENT_END_DATE_AFTER_START_DATE,
  ERR_MSG_APPOINTMENT_START_DATE_BEFORE_END_DATE,
  ERR_MSG_APPOINTMENT_START_DATE_END_DATE_MAX_DIFF,
  ERR_MSG_APPOINTMENT_START_DATE_END_DATE_MIN_DIFF,
} from '../appointments.constants';

export class CreateManyAppointmentsDto {
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @IsDateBefore('endDate', {
    message: ERR_MSG_APPOINTMENT_START_DATE_BEFORE_END_DATE,
  })
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  @IsDateAfter('startDate', {
    message: ERR_MSG_APPOINTMENT_END_DATE_AFTER_START_DATE,
  })
  @MinDateDiff('startDate', 7 * 24 * 60 * 60, {
    message: ERR_MSG_APPOINTMENT_START_DATE_END_DATE_MIN_DIFF,
  })
  @MaxDateDiff('startDate', 30 * 24 * 60 * 60, {
    message: ERR_MSG_APPOINTMENT_START_DATE_END_DATE_MAX_DIFF,
  })
  endDate: Date;
}
