import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  name: process.env.APP_NAME ?? 'SIMRS v2 API',
  url: process.env.APP_URL ?? 'http://localhost:3000',
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(','),
}));

export const dbConfig = registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'simrs_v2',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'simrs_dev_secret_change_in_prod',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'simrs_refresh_dev',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
}));

export const bpjsConfig = registerAs('bpjs', () => ({
  consId: process.env.BPJS_CONS_ID ?? '',
  secretKey: process.env.BPJS_SECRET_KEY ?? '',
  userKey: process.env.BPJS_USER_KEY ?? '',
  baseUrl: process.env.BPJS_BASE_URL ?? '',
}));
