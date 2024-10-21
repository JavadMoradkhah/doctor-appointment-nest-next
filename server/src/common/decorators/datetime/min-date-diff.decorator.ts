import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Checks if two dates difference is >= dateDiff
 * @param property - The target property name to validate against
 * @param dateDiff - The maximum number of seconds
 * @param validationOptions - Validation Options
 */
export function MinDateDiff(
  property: string,
  dateDiff: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'minDateDiff',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(date: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedDate = (args.object as any)[relatedPropertyName];

          return (
            date instanceof Date &&
            relatedDate instanceof Date &&
            date.getTime() - relatedDate.getTime() >= dateDiff * 1000
          );
        },
      },
    });
  };
}
