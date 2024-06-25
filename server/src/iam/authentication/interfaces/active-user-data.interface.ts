import { UserRole } from 'src/users/enums/user-role.enum';

export interface ActiveUserData {
  sub: string;
  role: UserRole;
}