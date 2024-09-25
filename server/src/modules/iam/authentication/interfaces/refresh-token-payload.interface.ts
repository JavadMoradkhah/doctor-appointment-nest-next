import { AccessTokenPayload } from './access-token-payload.interface';

export interface RefreshTokenPayload extends Omit<AccessTokenPayload, 'role'> {
  refreshTokenId: string;
}
