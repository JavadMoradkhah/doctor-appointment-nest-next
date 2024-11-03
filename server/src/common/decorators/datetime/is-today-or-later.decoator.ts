import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsTodayOrLater(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isTodayOrLater',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments) {
          const today = new Date(Date.now());

          return (
            value instanceof Date &&
            value.getFullYear() >= today.getFullYear() &&
            value.getMonth() >= today.getMonth() &&
            value.getDate() >= today.getDate()
          );
        },
      },
    });
  };
}
