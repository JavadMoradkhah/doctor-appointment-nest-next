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
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          let relatedValue = (args.object as any)[relatedPropertyName];

          value = value instanceof Date ? value : new Date(value);

          relatedValue =
            relatedValue instanceof Date
              ? relatedValue
              : new Date(relatedValue);

          return (
            !isNaN(value.getTime()) &&
            !isNaN(relatedValue.getTime()) &&
            value.getTime() - relatedValue.getTime() >= dateDiff * 1000
          );
        },
      },
    });
  };
}
