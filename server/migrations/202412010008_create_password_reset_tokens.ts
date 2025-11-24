import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('password_reset_tokens');
  if (exists) {
    await knex.schema.dropTable('password_reset_tokens');
  }
  await knex.schema.createTable('password_reset_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.uuid('user_id').notNullable();
    table.string('code_hash', 255).notNullable();
    table.string('plain_preview', 20).nullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('used_at').nullable();
    table.string('request_ip', 64).nullable();
    table.string('user_agent', 255).nullable();
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['expires_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('password_reset_tokens');
}

