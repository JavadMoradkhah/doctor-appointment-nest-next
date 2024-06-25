import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { USER_ROLE_KEY } from 'src/iam/authorization/decorators/roles.decorator';
import { REQUEST_USER_KEY } from 'src/iam/iam.constants';
import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';
import { UserRole } from 'src/users/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(USER_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const user: ActiveUserData = request[REQUEST_USER_KEY];

    if (!user || !roles.includes(user.role)) {
      return false;
    }

    return true;
  }
}
