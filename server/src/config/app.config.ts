export default () => ({
  environment: process.env.NODE_ENV || 'development',
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT) || 6379,
    url: process.env.REDIS_URL,
  },
  api: {
    sms: process.env.API_KEY_SMS,
  },
});
