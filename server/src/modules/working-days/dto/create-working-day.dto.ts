import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ERR_MSG_INVALID_TIME } from 'src/common/constants/datetime.constants';
import { IsTimeBefore } from 'src/common/decorators/datetime/is-time-before.decorator';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MaxTimeDiff } from 'src/common/decorators/datetime/max-time-diff.decorator';
import { MinTimeDiff } from 'src/common/decorators/datetime/min-time-diff.decorator';
import { Weekday } from '../enums/weekday.enum';
import {
  ERR_MSG_WORKING_DAY_BREAK_END_TIME_BEFORE_WORKING_DAY_END_TIME,
  ERR_MSG_WORKING_DAY_BREAK_START_MIN_DIFF_WITH_START_TIME,
  ERR_MSG_WORKING_DAY_BREAK_TIME_MAX_DURATION,
  ERR_MSG_WORKING_DAY_BREAK_TIME_MIN_DURATION,
  ERR_MSG_WORKING_DAY_MAX_DURATION,
  ERR_MSG_WORKING_DAY_MIN_DURATION,
} from '../working-days.constants';

export class CreateWorkingDayDto {
  @IsEnum(Weekday)
  @IsNotEmpty()
  weekday: Weekday;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  startsAt: string;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTimeDiff(
    'startsAt',
    { hours: 1 },
    { message: ERR_MSG_WORKING_DAY_MIN_DURATION },
  )
  @MaxTimeDiff(
    'startsAt',
    { hours: 12 },
    { message: ERR_MSG_WORKING_DAY_MAX_DURATION },
  )
  endsAt: string;

  @IsString()
  @IsOptional()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTimeDiff(
    'startsAt',
    { hours: 1 },
    { message: ERR_MSG_WORKING_DAY_BREAK_START_MIN_DIFF_WITH_START_TIME },
  )
  breakStartsAt: string;

  @IsString()
  @ValidateIf((workingDay: CreateWorkingDayDto) => !!workingDay.breakStartsAt)
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @IsTimeBefore('endsAt', {
    message: ERR_MSG_WORKING_DAY_BREAK_END_TIME_BEFORE_WORKING_DAY_END_TIME,
  })
  @MinTimeDiff(
    'breakStartsAt',
    { minutes: 15 },
    { message: ERR_MSG_WORKING_DAY_BREAK_TIME_MIN_DURATION },
  )
  @MaxTimeDiff(
    'breakStartsAt',
    { hours: 4 },
    { message: ERR_MSG_WORKING_DAY_BREAK_TIME_MAX_DURATION },
  )
  breakEndsAt: string;
}
