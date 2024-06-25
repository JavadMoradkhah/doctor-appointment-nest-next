import { ActiveUserData } from 'src/iam/interfaces/authentication/active-user-data.interface';

export interface AccessTokenPayload extends Partial<ActiveUserData> {}
