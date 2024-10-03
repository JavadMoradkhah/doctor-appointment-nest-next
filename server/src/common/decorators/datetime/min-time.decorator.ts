import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import {
  parseTime,
  TimeObj,
  timeToSeconds,
} from 'src/common/utils/datetime.util';

export function MinTime(
  minTime: TimeObj,
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
          const inputTime = parseTime(value);
          if (!inputTime) return false;
          return timeToSeconds(inputTime) >= timeToSeconds(minTime);
        },
      },
    });
  };
}
