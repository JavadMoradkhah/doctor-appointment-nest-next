import { registerAs } from '@nestjs/config';

export default registerAs('refreshToken', () => ({
  secret: process.env.JWT_REFRESH_SECRET,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  ttl: parseInt(process.env.JWT_REFRESH_TTL ?? '86400', 10),
}));
