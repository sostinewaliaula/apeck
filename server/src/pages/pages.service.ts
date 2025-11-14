import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';

import { KNEX_CONNECTION } from '../database/database.constants';

@Injectable()
export class PagesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findPublishedPage(slug: string) {
    const page = await this.knex('pages').where({ slug, status: 'published' }).first();
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const sections = await this.knex('page_sections')
      .where({ page_id: page.id, status: 'published' })
      .orderBy('display_order', 'asc');
    return {
      ...page,
      sections,
    };
  }

  async listRoutes() {
    return this.knex('routes').where({ is_active: true }).select();
  }
}

