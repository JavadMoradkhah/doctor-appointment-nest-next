import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Duration } from 'src/common/interfaces/duration.interface';
import { durationToSeconds, parseTime } from 'src/common/utils/datetime.util';

export function MinTime(
  minTime: Duration,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'minTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          return (
            durationToSeconds(parseTime(value) ?? {}) >=
            durationToSeconds(minTime)
          );
        },
      },
    });
  };
}
