import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

import { KNEX_CONNECTION } from '../database/database.constants';
import { CreateNewsDto, NewsStatus } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  status: NewsStatus;
  published_at: Date | null;
  hero_media_id: string | null;
  hero_image_url: string | null;
  show_on_home: 0 | 1 | boolean;
  home_display_order: number;
  reading_time: string | null;
  author_id: string | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class NewsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private table() {
    return this.knex<NewsRow>('news_posts');
  }

  private mapRow(row: Partial<NewsRow>) {
    if (!row) return row;
    return {
      ...row,
      show_on_home: Boolean(row.show_on_home),
      home_display_order: row.home_display_order ?? 0,
    } as NewsRow & { show_on_home: boolean };
  }

  private async reloadNews(id: string) {
    const row = await this.table().where({ id }).first();
    if (!row) {
      throw new NotFoundException('News article not found');
    }
    return this.mapRow(row);
  }

  private normalizeSlug(value: string) {
    return (
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 120) || 'news'
    );
  }

  private async ensureUniqueSlug(base: string, excludeId?: string) {
    const baseSlug = this.normalizeSlug(base);
    let slug = baseSlug;
    for (let counter = 1; ; counter += 1) {
      const query = this.table().where({ slug });
      if (excludeId) {
        query.andWhere('id', '!=', excludeId);
      }
      const existing = await query.first();
      if (!existing) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
    }
  }

  private determinePublishedAt(
    status: NewsStatus | undefined,
    provided?: string,
  ) {
    if (status === 'published') {
      if (provided) {
        return new Date(provided);
      }
      return this.knex.fn.now();
    }
    if (status === 'scheduled' && provided) {
      return new Date(provided);
    }
    return null;
  }

  async listPublicNews(options?: { featuredOnly?: boolean; limit?: number }) {
    const query = this.table()
      .select(
        'id',
        'slug',
        'title',
        'excerpt',
        'hero_image_url',
        'hero_media_id',
        'reading_time',
        'published_at',
        'show_on_home',
        'home_display_order',
      )
      .where({ status: 'published' })
      .andWhere((builder) =>
        builder
          .whereNull('published_at')
          .orWhere('published_at', '<=', this.knex.fn.now()),
      );

    if (options?.featuredOnly) {
      query.andWhere('show_on_home', true).orderBy('home_display_order', 'asc');
    } else {
      query.orderBy('published_at', 'desc');
    }
    if (options?.limit) {
      query.limit(options.limit);
    }
    const rows = await query;
    return rows.map((row) => this.mapRow(row));
  }

  async getPublishedBySlug(slug: string) {
    const row = await this.table()
      .where({ slug, status: 'published' })
      .andWhere((builder) =>
        builder
          .whereNull('published_at')
          .orWhere('published_at', '<=', this.knex.fn.now()),
      )
      .first();
    if (!row) {
      throw new NotFoundException('News article not found');
    }
    return this.mapRow(row);
  }

  async listAdminNews(filters?: {
    status?: NewsStatus;
    showOnHome?: string;
    search?: string;
  }) {
    const query = this.table().select('*').orderBy('created_at', 'desc');
    if (filters?.status) {
      query.where({ status: filters.status });
    }
    if (filters?.showOnHome) {
      query.andWhere('show_on_home', filters.showOnHome === 'true');
    }
    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      query.andWhere((builder) => {
        builder
          .whereRaw('LOWER(title) LIKE ?', [term])
          .orWhereRaw('LOWER(excerpt) LIKE ?', [term]);
      });
    }
    const rows = await query;
    return rows.map((row) => this.mapRow(row));
  }

  async findAdminById(id: string) {
    const row = await this.table().where({ id }).first();
    if (!row) throw new NotFoundException('News article not found');
    return this.mapRow(row);
  }

  async createNews(dto: CreateNewsDto, userId?: string) {
    const slug = await this.ensureUniqueSlug(dto.slug ?? dto.title);
    const status: NewsStatus = dto.status ?? 'draft';
    const publishedAt = this.determinePublishedAt(status, dto.publishedAt);

    const id = randomUUID();
    await this.table().insert({
      id,
      slug,
      title: dto.title,
      excerpt: dto.excerpt ?? null,
      body: dto.body,
      status,
      published_at: publishedAt,
      hero_media_id: dto.heroMediaId ?? null,
      hero_image_url: dto.heroImageUrl ?? null,
      show_on_home: dto.showOnHome ?? false,
      home_display_order: dto.homeDisplayOrder ?? 0,
      reading_time: dto.readingTime ?? null,
      author_id: dto.authorId ?? userId ?? null,
    });
    return this.reloadNews(id);
  }

  async updateNews(id: string, dto: UpdateNewsDto) {
    const updates: Record<string, unknown> = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.excerpt !== undefined) updates.excerpt = dto.excerpt;
    if (dto.body !== undefined) updates.body = dto.body;
    if (dto.heroMediaId !== undefined) updates.hero_media_id = dto.heroMediaId;
    if (dto.heroImageUrl !== undefined)
      updates.hero_image_url = dto.heroImageUrl;
    if (dto.showOnHome !== undefined) updates.show_on_home = dto.showOnHome;
    if (dto.homeDisplayOrder !== undefined)
      updates.home_display_order = dto.homeDisplayOrder;
    if (dto.readingTime !== undefined) updates.reading_time = dto.readingTime;
    if (dto.authorId !== undefined) updates.author_id = dto.authorId;
    if (dto.status !== undefined) {
      updates.status = dto.status;
      updates.published_at = this.determinePublishedAt(
        dto.status,
        dto.publishedAt,
      );
    } else if (dto.publishedAt !== undefined) {
      updates.published_at = dto.publishedAt ? new Date(dto.publishedAt) : null;
    }
    if (dto.slug !== undefined) {
      updates.slug = await this.ensureUniqueSlug(dto.slug, id);
    }

    const updated = await this.table().where({ id }).update(updates);
    if (!updated) {
      throw new NotFoundException('News article not found');
    }
    return this.reloadNews(id);
  }

  async publishNews(id: string) {
    const updated = await this.table().where({ id }).update({
      status: 'published',
      published_at: this.knex.fn.now(),
    });
    if (!updated) {
      throw new NotFoundException('News article not found');
    }
    return this.reloadNews(id);
  }

  async deleteNews(id: string) {
    const deleted = await this.table().where({ id }).delete();
    if (!deleted) {
      throw new NotFoundException('News article not found');
    }
    return { success: true };
  }
}
