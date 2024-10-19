import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsDateAfter } from 'src/common/decorators/datetime/is-date-after.decorator';
import { IsDateBefore } from 'src/common/decorators/datetime/is-date-before.decorator';
import {
  ERR_MSG_DAY_OFF_END_DATE_AFTER_START_DATE,
  ERR_MSG_DAY_OFF_START_DATE_BEFORE_END_DATE,
} from '../dayoff.constants';

export class CreateDayOffDto {
  @IsDateString()
  @IsNotEmpty()
  @IsDateBefore('endDate', {
    message: ERR_MSG_DAY_OFF_START_DATE_BEFORE_END_DATE,
  })
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  @IsDateAfter('startDate', {
    message: ERR_MSG_DAY_OFF_END_DATE_AFTER_START_DATE,
  })
  endDate: Date;

  @IsString()
  @IsOptional()
  @Length(3, 255)
  description?: string;
}
