import { ActiveUserData } from 'src/modules/iam/authentication/interfaces/active-user-data.interface';

export interface AccessTokenPayload extends Partial<ActiveUserData> {}
