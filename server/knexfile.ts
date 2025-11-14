import type { Knex } from 'knex';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const envCandidates = process.env.NODE_ENV === 'production' ? ['.env'] : ['.env', '.env.local'];
envCandidates
  .map((file) => resolve(__dirname, file))
  .filter((filePath) => existsSync(filePath))
  .forEach((filePath) => loadEnv({ path: filePath, override: true }));

const getConnection = () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'apeck_cms',
  timezone: 'Z',
  dateStrings: true,
});

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: getConnection(),
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
  },
  production: {
    client: 'mysql2',
    connection: getConnection(),
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
  },
};

export default config;

