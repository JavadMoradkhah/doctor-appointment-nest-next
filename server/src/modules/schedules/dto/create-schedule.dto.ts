import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ERR_MSG_INVALID_TIME } from 'src/common/constants/datetime.constants';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MinTimeDifferenceWith } from 'src/common/decorators/datetime/min-time-difference-with.decorator';

export class CreateScheduleDto {
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(7)
  day: number;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  startAt: string;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTimeDifferenceWith('startAt', 1 * 60 * 60, {
    message: 'روز کاری حداقل باید یک ساعت باشد',
  })
  endAt: string;
}
