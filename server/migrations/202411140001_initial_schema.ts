import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE TABLE IF NOT EXISTS knex_migrations_lock (is_locked int not null)');

  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('first_name', 120).notNullable();
    table.string('last_name', 120).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.enum('role', ['admin', 'editor', 'viewer']).notNullable().defaultTo('viewer');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('last_login_at').nullable();
    table.string('reset_token', 255).nullable();
    table.timestamp('reset_token_expires_at').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('user_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('refresh_token_hash', 255).notNullable();
    table.string('user_agent', 255).nullable();
    table.string('ip_address', 64).nullable();
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
    table.index(['user_id']);
  });

  await knex.schema.createTable('media_assets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('file_name', 255).notNullable();
    table.string('url', 2048).notNullable();
    table.string('alt_text', 255).nullable();
    table.string('mime_type', 120).nullable();
    table.integer('width').nullable();
    table.integer('height').nullable();
    table.string('category', 120).nullable();
    table
      .uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('pages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('slug', 255).notNullable().unique();
    table.string('title', 255).notNullable();
    table.text('excerpt').nullable();
    table.enum('status', ['draft', 'published']).notNullable().defaultTo('draft');
    table.string('seo_title', 255).nullable();
    table.text('seo_description').nullable();
    table.json('seo_metadata').nullable();
    table
      .uuid('featured_media_id')
      .references('id')
      .inTable('media_assets')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('page_sections', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table
      .uuid('page_id')
      .notNullable()
      .references('id')
      .inTable('pages')
      .onDelete('CASCADE');
    table.string('key', 150).notNullable();
    table.integer('display_order').notNullable().defaultTo(0);
    table.enum('status', ['draft', 'published']).notNullable().defaultTo('draft');
    table.json('content').notNullable();
    table.timestamps(true, true);
    table.unique(['page_id', 'key']);
  });

  await knex.schema.createTable('routes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('slug', 255).notNullable().unique();
    table.string('target', 255).notNullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('news_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('slug', 255).notNullable().unique();
    table.string('title', 255).notNullable();
    table.text('excerpt').nullable();
    table.text('body', 'longtext').notNullable();
    table.enum('status', ['draft', 'scheduled', 'published']).notNullable().defaultTo('draft');
    table.timestamp('published_at').nullable();
    table
      .uuid('hero_media_id')
      .references('id')
      .inTable('media_assets')
      .onDelete('SET NULL');
    table
      .uuid('author_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('description').nullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.string('location', 255).nullable();
    table.string('category', 120).nullable();
    table.enum('status', ['draft', 'published']).notNullable().defaultTo('draft');
    table
      .uuid('cover_media_id')
      .references('id')
      .inTable('media_assets')
      .onDelete('SET NULL');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('programs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.text('summary').nullable();
    table.text('body', 'longtext').nullable();
    table.enum('status', ['draft', 'published']).notNullable().defaultTo('draft');
    table
      .uuid('hero_media_id')
      .references('id')
      .inTable('media_assets')
      .onDelete('SET NULL');
    table.json('metadata').nullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable('membership_plans', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('name', 150).notNullable();
    table.string('slug', 150).notNullable().unique();
    table.decimal('fee_amount', 10, 2).notNullable();
    table.string('currency', 10).notNullable().defaultTo('KES');
    table.text('description').nullable();
    table.json('benefits').nullable();
    table.json('requirements').nullable();
    table.enum('status', ['draft', 'published']).notNullable().defaultTo('published');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('membership_plans')
    .dropTableIfExists('programs')
    .dropTableIfExists('events')
    .dropTableIfExists('news_posts')
    .dropTableIfExists('routes')
    .dropTableIfExists('page_sections')
    .dropTableIfExists('pages')
    .dropTableIfExists('media_assets')
    .dropTableIfExists('user_sessions')
    .dropTableIfExists('users');
}

