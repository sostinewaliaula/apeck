import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('membership_applications', (table) => {
    // Ministry/Church Details
    table.string('church_name', 255).nullable();
    table.string('title', 100).nullable();
    table.string('title_other', 100).nullable();
    
    // Referral Details
    table.string('referral_name', 255).nullable();
    table.string('referral_apeck_number', 100).nullable();
    table.string('referral_phone', 50).nullable();
    
    // Declaration
    table.string('signature', 255).nullable();
    table.date('declaration_date').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('membership_applications', (table) => {
    table.dropColumn('church_name');
    table.dropColumn('title');
    table.dropColumn('title_other');
    table.dropColumn('referral_name');
    table.dropColumn('referral_apeck_number');
    table.dropColumn('referral_phone');
    table.dropColumn('signature');
    table.dropColumn('declaration_date');
  });
}

