import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('pages', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  });

  await knex.schema.alterTable('page_sections', (table) => {
    table.timestamp('deleted_at').nullable().after('updated_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('pages', (table) => {
    table.dropColumn('deleted_at');
  });

  await knex.schema.alterTable('page_sections', (table) => {
    table.dropColumn('deleted_at');
  });
}

