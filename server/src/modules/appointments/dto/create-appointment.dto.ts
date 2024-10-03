import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { IPostgresInterval } from 'postgres-interval';
import { ERR_MSG_INVALID_TIME } from 'src/common/constants/datetime.constants';
import { IsTime } from 'src/common/decorators/datetime/is-time.decorator';
import { MaxTime } from 'src/common/decorators/datetime/max-time.decorator';
import { MinTime } from 'src/common/decorators/datetime/min-time.decorator';
import {
  ERR_MSG_APPOINTMENTS_GAP_MAX_TIME,
  ERR_MSG_APPOINTMENTS_GAP_MIN_TIME,
} from 'src/modules/doctors/doctors.constants';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @IsTime({ message: ERR_MSG_INVALID_TIME })
  @MinTime(
    { hours: 0, minutes: 5, seconds: 0 },
    { message: ERR_MSG_APPOINTMENTS_GAP_MIN_TIME },
  )
  @MaxTime(
    { hours: 1, minutes: 0, seconds: 0 },
    { message: ERR_MSG_APPOINTMENTS_GAP_MAX_TIME },
  )
  appointmentsGap: IPostgresInterval;
}
