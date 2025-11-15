import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class PagesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private async reloadPage(pageId: string) {
    const page = await this.knex('pages').where({ id: pageId }).first();
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  private async reloadSection(sectionId: string) {
    const section = await this.knex('page_sections')
      .where({ id: sectionId })
      .first();
    if (!section) {
      throw new NotFoundException('Section not found');
    }
    return this.mapSection(section);
  }

  private mapSection<T extends Record<string, unknown> | undefined>(
    section: T,
  ) {
    if (!section) return section;
    const content = section.content;
    return {
      ...section,
      content: typeof content === 'string' ? JSON.parse(content) : content,
    };
  }

  async findPublishedPage(slug: string) {
    const page = await this.knex('pages')
      .where({ slug, status: 'published' })
      .first();
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const sections = await this.knex('page_sections')
      .where({ page_id: page.id, status: 'published' })
      .orderBy('display_order', 'asc');
    return {
      ...page,
      sections: sections.map((section) => this.mapSection(section)),
    };
  }

  async listRoutes() {
    return this.knex('routes').where({ is_active: true }).select();
  }

  async listPages(filter?: { slug?: string }) {
    const query = this.knex('pages').select('*').orderBy('updated_at', 'desc');
    if (filter?.slug) {
      query.where({ slug: filter.slug });
    }
    return query;
  }

  async findPageById(pageId: string) {
    const page = await this.knex('pages').where({ id: pageId }).first();
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const sections = await this.knex('page_sections')
      .where({ page_id: pageId })
      .orderBy('display_order', 'asc');
    return {
      ...page,
      sections: sections.map((section) => this.mapSection(section)),
    };
  }

  async createPage(dto: CreatePageDto) {
    const id = uuid();
    await this.knex('pages').insert({
      id,
      slug: dto.slug,
      title: dto.title,
      excerpt: dto.excerpt ?? null,
      seo_title: dto.seoTitle ?? null,
      seo_description: dto.seoDescription ?? null,
      status: 'draft',
    });
    return this.reloadPage(id);
  }

  async updatePage(pageId: string, dto: UpdatePageDto) {
    const updates: Record<string, unknown> = {};
    if (dto.slug !== undefined) updates.slug = dto.slug;
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.excerpt !== undefined) updates.excerpt = dto.excerpt;
    if (dto.seoTitle !== undefined) updates.seo_title = dto.seoTitle;
    if (dto.seoDescription !== undefined)
      updates.seo_description = dto.seoDescription;
    if (dto.status !== undefined) updates.status = dto.status;

    const affected = await this.knex('pages')
      .where({ id: pageId })
      .update(updates);
    if (!affected) {
      throw new NotFoundException('Page not found');
    }
    return this.reloadPage(pageId);
  }

  async publishPage(pageId: string) {
    const affected = await this.knex('pages')
      .where({ id: pageId })
      .update({ status: 'published' });
    if (!affected) {
      throw new NotFoundException('Page not found');
    }
    await this.knex('page_sections')
      .where({ page_id: pageId })
      .andWhere({ status: 'draft' })
      .update({ status: 'published' });
    return this.reloadPage(pageId);
  }

  async createSection(pageId: string, dto: CreateSectionDto) {
    const id = uuid();
    await this.knex('page_sections').insert({
      id,
      page_id: pageId,
      key: dto.key,
      display_order: dto.displayOrder,
      status: dto.status ?? 'draft',
      content: JSON.stringify(dto.content),
    });
    return this.reloadSection(id);
  }

  async updateSection(sectionId: string, dto: UpdateSectionDto) {
    const updates: Record<string, unknown> = {};
    if (dto.key !== undefined) updates.key = dto.key;
    if (dto.displayOrder !== undefined)
      updates.display_order = dto.displayOrder;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.content !== undefined)
      updates.content = JSON.stringify(dto.content);
    const affected = await this.knex('page_sections')
      .where({ id: sectionId })
      .update(updates);
    if (!affected) {
      throw new NotFoundException('Section not found');
    }
    return this.reloadSection(sectionId);
  }

  async deleteSection(sectionId: string) {
    const deleted = await this.knex('page_sections')
      .where({ id: sectionId })
      .delete();
    if (!deleted) {
      throw new NotFoundException('Section not found');
    }
    return { success: true };
  }
}
