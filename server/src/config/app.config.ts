export default () => ({
  environment: process.env.NODE_ENV || 'development',
  api: {
    sms: process.env.API_KEY_SMS,
  },
});
