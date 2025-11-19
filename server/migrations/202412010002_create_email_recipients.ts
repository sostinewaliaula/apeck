import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('email_recipients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('email', 255).notNullable();
    table.string('name', 255).nullable();
    table.enum('type', ['membership', 'general']).notNullable().defaultTo('membership');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.integer('display_order').notNullable().defaultTo(0);
    table.timestamps(true, true);
    table.index(['type', 'is_active']);
    table.unique(['email', 'type']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('email_recipients');
}

