import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  bucketName: process.env.S3_BUCKET_NAME,
  endpoint: process.env.S3_ENDPOINT,
  accessKey: process.env.S3_ACCESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
}));
