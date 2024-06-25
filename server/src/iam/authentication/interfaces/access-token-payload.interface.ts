import { ActiveUserData } from 'src/iam/authentication/interfaces/active-user-data.interface';

export interface AccessTokenPayload extends Partial<ActiveUserData> {}
