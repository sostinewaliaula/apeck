export default () => {
  const appUrl = process.env.APP_URL ?? 'http://localhost:4000';
  const frontendUrl = process.env.APP_FRONTEND_URL ?? 'http://localhost:5173';

  return {
    app: {
      port: parseInt(process.env.APP_PORT ?? '4000', 10),
      url: appUrl,
      frontendUrl,
    },
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '3306', 10),
      user: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      name: process.env.DB_NAME ?? 'apeck_cms',
    },
    jwt: {
      accessSecret: process.env.JWT_ACCESS_SECRET ?? 'access_secret',
      refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'refresh_secret',
      accessTtl: process.env.JWT_ACCESS_TTL ?? '900s',
      refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
    },
    security: {
      passwordPepper: process.env.PASSWORD_PEPPER ?? '',
    },
    email: {
      host: process.env.SMTP_HOST ?? 'mail.apeck.co.ke',
      port: parseInt(process.env.SMTP_PORT ?? '465', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER ?? '',
      password: process.env.SMTP_PASSWORD ?? '',
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'noreply@apeck.co.ke',
      membershipRecipient: process.env.MEMBERSHIP_EMAIL ?? 'membership@apeck.co.ke',
      contactRecipient: process.env.CONTACT_EMAIL ?? 'info@apeck.co.ke',
    },
    pesapal: {
      consumerKey: process.env.PESAPAL_CONSUMER_KEY ?? '',
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET ?? '',
      sandbox: process.env.PESAPAL_SANDBOX !== 'false',
    },
  };
};
