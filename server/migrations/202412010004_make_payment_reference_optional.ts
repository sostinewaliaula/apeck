import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('membership_applications', (table) => {
    // Make payment_reference nullable to support M-Pesa only payments
    table.string('payment_reference', 255).nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('membership_applications', (table) => {
    table.string('payment_reference', 255).notNullable().alter();
  });
}

