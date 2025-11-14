import { randomUUID } from 'crypto';
import knex, { Knex } from 'knex';
import bcrypt from 'bcrypt';
import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const envCandidates = ['.env', '.env.local'].map((file) => resolve(__dirname, '..', file));
envCandidates.filter((filePath) => existsSync(filePath)).forEach((filePath) => loadEnv({ path: filePath, override: true }));

const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL ?? 'admin@apeck.org';
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? 'ApeckAdmin#2025';
const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER;

if (!PASSWORD_PEPPER) {
  console.error('PASSWORD_PEPPER is required in env to seed admin.');
  process.exit(1);
}

const connectionConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'apeck_cms',
  timezone: 'Z',
  dateStrings: true,
};

async function seedAdmin() {
  const db: Knex = knex({
    client: 'mysql2',
    connection: connectionConfig,
  });

  try {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD + PASSWORD_PEPPER, 12);
    const existing = await db('users').where({ email: ADMIN_EMAIL }).first();

    if (existing) {
      await db('users').where({ id: existing.id }).update({
        first_name: 'Site',
        last_name: 'Admin',
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        updated_at: db.fn.now(),
      });
      console.log(`Updated existing admin user (${ADMIN_EMAIL}) with new credentials.`);
    } else {
      await db('users').insert({
        id: randomUUID(),
        first_name: 'Site',
        last_name: 'Admin',
        email: ADMIN_EMAIL,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true,
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });
      console.log(`Created new admin user (${ADMIN_EMAIL}).`);
    }

    console.log('Login credentials:');
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exitCode = 1;
  } finally {
    await db.destroy();
  }
}

void seedAdmin();

