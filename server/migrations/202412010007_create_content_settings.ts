import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('content_settings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('key', 100).notNullable().unique();
    table.string('value', 255).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('content_settings');
}

