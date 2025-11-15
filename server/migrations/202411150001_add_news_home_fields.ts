import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('news_posts', (table) => {
    table.string('hero_image_url', 2048).nullable();
    table.boolean('show_on_home').notNullable().defaultTo(false);
    table.integer('home_display_order').notNullable().defaultTo(0);
    table.string('reading_time', 50).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('news_posts', (table) => {
    table.dropColumn('hero_image_url');
    table.dropColumn('show_on_home');
    table.dropColumn('home_display_order');
    table.dropColumn('reading_time');
  });
}


