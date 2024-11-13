import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IsDateAfter } from 'src/common/decorators/datetime/is-date-after.decorator';
import { IsDateBefore } from 'src/common/decorators/datetime/is-date-before.decorator';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MaxDateDiff } from 'src/common/decorators/datetime/max-date-diff.decorator';
import { MaxTime } from 'src/common/decorators/datetime/max-time.decorator';
import { MinDateDiff } from 'src/common/decorators/datetime/min-date-diff.decorator';
import { MinTime } from 'src/common/decorators/datetime/min-time.decorator';
import {
  ERR_MSG_SCHEDULE_APPOINTMENTS_MAX_DURATION,
  ERR_MSG_SCHEDULE_APPOINTMENTS_MIN_DURATION,
  ERR_MSG_SCHEDULE_END_DATE_AFTER_START_DATE,
  ERR_MSG_SCHEDULE_MAX_DAYS,
  ERR_MSG_SCHEDULE_MIN_DAYS,
  ERR_MSG_SCHEDULE_START_DATE_BEFORE_END_DATE,
} from '../schedules.constants';

export class CreateScheduleDto {
  @IsDateString()
  @IsNotEmpty()
  @IsDateBefore('endDate', {
    message: ERR_MSG_SCHEDULE_START_DATE_BEFORE_END_DATE,
  })
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  @IsDateAfter('startDate', {
    message: ERR_MSG_SCHEDULE_END_DATE_AFTER_START_DATE,
  })
  @MinDateDiff('startDate', 1 * 24 * 60 * 60, {
    message: ERR_MSG_SCHEDULE_MIN_DAYS,
  })
  @MaxDateDiff('startDate', 30 * 24 * 60 * 60, {
    message: ERR_MSG_SCHEDULE_MAX_DAYS,
  })
  endDate: string;

  @IsString()
  @IsTime()
  @MinTime(
    { minutes: 5 },
    { message: ERR_MSG_SCHEDULE_APPOINTMENTS_MIN_DURATION },
  )
  @MaxTime(
    { hours: 1 },
    { message: ERR_MSG_SCHEDULE_APPOINTMENTS_MAX_DURATION },
  )
  appointmentsDuration: string;

  @IsBoolean()
  isAvailable: boolean;
}
