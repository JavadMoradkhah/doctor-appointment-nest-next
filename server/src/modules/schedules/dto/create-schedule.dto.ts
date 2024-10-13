import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ERR_MSG_INVALID_TIME } from 'src/common/constants/datetime.constants';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MaxTimeDifferenceWith } from 'src/common/decorators/datetime/max-time-difference-with.decorator';
import { MinTimeDifferenceWith } from 'src/common/decorators/datetime/min-time-difference-with.decorator';
import { Weekday } from '../enums/weekday.enum';
import {
  ERR_MSG_SCHEDULE_MAX_HOURS,
  ERR_MSG_SCHEDULE_MIN_HOURS,
} from '../schedules.constants';

export class CreateScheduleDto {
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
  @MinTimeDifferenceWith('startAt', 1 * 60 * 60, {
    message: ERR_MSG_SCHEDULE_MIN_HOURS,
  })
  @MaxTimeDifferenceWith('startAt', 12 * 60 * 60, {
    message: ERR_MSG_SCHEDULE_MAX_HOURS,
  })
  endsAt: string;
}
