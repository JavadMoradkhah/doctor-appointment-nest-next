import {
  CallHandler,
  ClassSerializerContextOptions,
  ClassSerializerInterceptor,
  ExecutionContext,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ActiveUserData } from 'src/modules/iam/authentication/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'src/modules/iam/iam.constants';

@Injectable()
export class RoleBasedSerializerInterceptor extends ClassSerializerInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();

    const user: ActiveUserData = request[REQUEST_USER_KEY];

    if (!user) {
      return next.handle();
    }

    const contextOptions = this.getContextOptions(context);

    const options: ClassSerializerContextOptions = {
      ...this.defaultOptions,
      ...contextOptions,
      groups: [...(contextOptions?.groups ?? []), user.role],
    };

    return next
      .handle()
      .pipe(
        map((res: PlainLiteralObject | Array<PlainLiteralObject>) =>
          this.serialize(res, options),
        ),
      );
  }
}
