import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ERR_MSG_INVALID_DATE } from '../constants/datetime.constants';

@Injectable()
export class ParseDatePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(ERR_MSG_INVALID_DATE);
    }

    return parsedDate;
  }
}
