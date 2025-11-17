export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '4000', 10),
    url: process.env.APP_URL ?? 'http://localhost:4000',
    frontendUrl: process.env.APP_FRONTEND_URL ?? 'http://localhost:5173',
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
});
