import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsDateBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDateBefore',
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
            value.getTime() < relatedValue.getTime()
          );
        },
      },
    });
  };
}
