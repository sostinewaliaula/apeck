import { Knex } from 'knex';

const TABLE = 'membership_applications';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLE);
  if (!hasTable) {
    return;
  }

  await knex.schema.alterTable(TABLE, (table) => {
    table.string('organization_name').nullable();
    table.string('organization_registration_number').nullable();
    table.string('organization_kra_pin').nullable();
    table.string('headquarters_location').nullable();
    table.string('organization_email').nullable();
    table.string('organization_phone').nullable();

    table.string('chairperson_name').nullable();
    table.string('chairperson_id_number').nullable();
    table.string('chairperson_kra_pin').nullable();
    table.string('chairperson_phone').nullable();
    table.string('chairperson_email').nullable();

    table.string('secretary_name').nullable();
    table.string('secretary_id_number').nullable();
    table.string('secretary_kra_pin').nullable();
    table.string('secretary_phone').nullable();
    table.string('secretary_email').nullable();

    table.string('treasurer_name').nullable();
    table.string('treasurer_id_number').nullable();
    table.string('treasurer_kra_pin').nullable();
    table.string('treasurer_phone').nullable();
    table.string('treasurer_email').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TABLE);
  if (!hasTable) {
    return;
  }

  await knex.schema.alterTable(TABLE, (table) => {
    table.dropColumns(
      'organization_name',
      'organization_registration_number',
      'organization_kra_pin',
      'headquarters_location',
      'organization_email',
      'organization_phone',
      'chairperson_name',
      'chairperson_id_number',
      'chairperson_kra_pin',
      'chairperson_phone',
      'chairperson_email',
      'secretary_name',
      'secretary_id_number',
      'secretary_kra_pin',
      'secretary_phone',
      'secretary_email',
      'treasurer_name',
      'treasurer_id_number',
      'treasurer_kra_pin',
      'treasurer_phone',
      'treasurer_email',
    );
  });
}

