import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { Duration } from 'src/common/interfaces/duration.interface';
import { parseTime, durationToSeconds } from 'src/common/utils/datetime.util';

export function MaxTimeDiff(
  property: string,
  timeDiff: Duration,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxTimeDiff',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return (
            durationToSeconds(parseTime(value) ?? {}) -
              durationToSeconds(parseTime(relatedValue) ?? {}) <=
            durationToSeconds(timeDiff)
          );
        },
      },
    });
  };
}
