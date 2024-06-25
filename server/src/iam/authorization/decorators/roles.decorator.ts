import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/enums/user-role.enum';

export const USER_ROLE_KEY = 'userRole';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(USER_ROLE_KEY, roles);
