import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { parseTime, timeToSeconds } from 'src/common/utils/datetime.util';

export function MaxTimeDifferenceWith(
  targetProperty: string,
  timeDiffInSeconds: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxTimeDifferenceWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [targetProperty],
      options: validationOptions,
      validator: {
        validate(time: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const targetValue = (args.object as any)[relatedPropertyName];

          const sourceTime = parseTime(time);
          const targetTime = parseTime(targetValue);

          if (!sourceTime || !targetTime) return false;

          return (
            timeToSeconds(sourceTime) - timeToSeconds(targetTime) <=
            timeDiffInSeconds
          );
        },
      },
    });
  };
}
