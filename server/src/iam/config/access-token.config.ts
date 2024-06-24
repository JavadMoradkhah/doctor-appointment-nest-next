import { registerAs } from '@nestjs/config';

export default registerAs('accessToken', () => ({
  secret: process.env.JWT_ACCESS_SECRET,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  ttl: parseInt(process.env.JWT_ACCESS_TTL ?? '3600', 10),
}));
