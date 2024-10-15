import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { ERR_MSG_INVALID_TIME } from 'src/common/constants/datetime.constants';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MaxTimeDiff } from 'src/common/decorators/datetime/max-time-diff.decorator';
import { MinTimeDiff } from 'src/common/decorators/datetime/min-time-diff.decorator';
import { Weekday } from '../enums/weekday.enum';
import {
  ERR_MSG_SCHEDULE_BREAK_END_TIME_BEFORE_SCHEDULE_END_TIME,
  ERR_MSG_SCHEDULE_BREAK_START_MIN_DIFF_WITH_START_TIME,
  ERR_MSG_SCHEDULE_BREAK_TIME_MAX_DURATION,
  ERR_MSG_SCHEDULE_BREAK_TIME_MIN_DURATION,
  ERR_MSG_SCHEDULE_MAX_DURATION,
  ERR_MSG_SCHEDULE_MIN_DURATION,
} from '../schedules.constants';
import { IsTimeBefore } from 'src/common/decorators/datetime/is-time-before.decorator';

export class CreateScheduleDto {
  @IsEnum(Weekday)
  @IsNotEmpty()
  weekday: Weekday;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  startsAt: Date;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTimeDiff(
    'startsAt',
    { hours: 1 },
    { message: ERR_MSG_SCHEDULE_MIN_DURATION },
  )
  @MaxTimeDiff(
    'startsAt',
    { hours: 12 },
    { message: ERR_MSG_SCHEDULE_MAX_DURATION },
  )
  endsAt: Date;

  @IsString()
  @IsOptional()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTimeDiff(
    'startsAt',
    { hours: 1 },
    { message: ERR_MSG_SCHEDULE_BREAK_START_MIN_DIFF_WITH_START_TIME },
  )
  breakStartsAt: Date;

  @IsString()
  @ValidateIf((schedule: CreateScheduleDto) => !!schedule.breakStartsAt)
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @IsTimeBefore('endsAt', {
    message: ERR_MSG_SCHEDULE_BREAK_END_TIME_BEFORE_SCHEDULE_END_TIME,
  })
  @MinTimeDiff(
    'breakStartsAt',
    { minutes: 15 },
    { message: ERR_MSG_SCHEDULE_BREAK_TIME_MIN_DURATION },
  )
  @MaxTimeDiff(
    'breakStartsAt',
    { hours: 4 },
    { message: ERR_MSG_SCHEDULE_BREAK_TIME_MAX_DURATION },
  )
  breakEndsAt: Date;

  @IsNumber()
  @IsInt()
  @Min(5) // 5 minutes
  @Max(720) // 12 * 60 = 720 minutes
  @IsNotEmpty()
  appointmentsDuration: number;
}
