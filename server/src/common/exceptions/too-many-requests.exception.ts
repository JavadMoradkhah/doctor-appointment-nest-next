import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
  constructor(message: string | Record<string, any>) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, {
      description: 'Too Many Requests',
    });
  }
}
