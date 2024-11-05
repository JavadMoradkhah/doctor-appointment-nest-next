import { UserRole } from 'src/modules/users/enums/user-role.enum';

export enum SerializerGroup {
  ADMIN = UserRole.ADMIN,
  DOCTOR = UserRole.DOCTOR,
  PATIENT = UserRole.PATIENT,
  OWNER = 'owner',
}
