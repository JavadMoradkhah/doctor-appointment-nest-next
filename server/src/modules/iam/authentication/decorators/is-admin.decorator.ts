import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ActiveUserData } from 'src/modules/iam/authentication/interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from 'src/modules/iam/iam.constants';
import { UserRole } from 'src/modules/users/enums/user-role.enum';

export const IsAdmin = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[REQUEST_USER_KEY];
    return !!user && user.role === UserRole.ADMIN;
  },
);
