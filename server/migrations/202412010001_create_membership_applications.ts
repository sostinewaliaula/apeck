import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('membership_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('full_name', 255).notNullable();
    table.string('phone', 50).notNullable();
    table.string('id_number', 50).notNullable();
    table.string('email', 255).notNullable();
    table.string('county', 100).notNullable();
    table.string('sub_county', 100).nullable();
    table.string('ward', 100).nullable();
    table.string('diaspora_country', 100).nullable();
    table.string('mpesa_code', 100).nullable();
    table.string('payment_reference', 255).notNullable();
    table.string('payment_gateway', 50).notNullable().defaultTo('paystack');
    table.decimal('amount_paid', 10, 2).notNullable();
    table.string('membership_tier', 100).notNullable().defaultTo('Individual Member');
    table.enum('status', ['pending', 'approved', 'rejected', 'completed']).notNullable().defaultTo('pending');
    table.text('notes').nullable();
    table.boolean('email_sent').notNullable().defaultTo(false);
    table.timestamp('email_sent_at').nullable();
    table.timestamps(true, true);
    table.index(['email']);
    table.index(['payment_reference']);
    table.index(['status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('membership_applications');
}

