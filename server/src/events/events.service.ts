import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

import { KNEX_CONNECTION } from '../database/database.constants';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  category: string | null;
  status: 'draft' | 'published';
  cover_media_id: string | null;
  created_at: Date;
  updated_at: Date;
};

@Injectable()
export class EventsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  private table() {
    return this.knex<EventRow>('events');
  }

  private normalizeSlug(value: string) {
    return (
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 120) || 'event'
    );
  }

  private async ensureUniqueSlug(base: string, excludeId?: string) {
    const baseSlug = this.normalizeSlug(base);
    let slug = baseSlug;
    for (let counter = 1; ; counter += 1) {
      const query = this.table().where({ slug });
      if (excludeId) query.andWhere('id', '!=', excludeId);
      const existing = await query.first();
      if (!existing) return slug;
      slug = `${baseSlug}-${counter}`;
    }
  }

  private withCoverUrl(q: Knex.QueryBuilder) {
    return q
      .leftJoin('media_assets as m', 'events.cover_media_id', 'm.id')
      .select('events.*', this.knex.raw('m.url as cover_image_url'));
  }

  async listPublic() {
    const rows = await this.withCoverUrl(this.table().select('*'))
      .where({ status: 'published' })
      .orderBy('start_date', 'asc');
    return rows;
  }

  async listAdmin() {
    const rows = await this.withCoverUrl(this.table().select('events.*')).orderBy(
      'events.created_at',
      'desc',
    );
    return rows;
  }

  async create(dto: CreateEventDto) {
    const id = randomUUID();
    const slug = await this.ensureUniqueSlug(dto.slug ?? dto.title);
    await this.table().insert({
      id,
      slug,
      title: dto.title,
      description: dto.description ?? null,
      start_date: dto.startDate,
      end_date: dto.endDate ?? null,
      location: dto.location ?? null,
      category: dto.category ?? null,
      status: dto.status ?? 'draft',
      cover_media_id: dto.coverMediaId ?? null,
    });
    if (dto.coverImageUrl) {
      // create media record ad-hoc for a provided URL, if needed
      const mediaId = randomUUID();
      await this.knex('media_assets').insert({
        id: mediaId,
        file_name: dto.coverImageUrl.split('/').pop() ?? 'cover.jpg',
        url: dto.coverImageUrl,
      });
      await this.table().where({ id }).update({ cover_media_id: mediaId });
    }
    return this.findById(id);
  }

  async update(id: string, dto: UpdateEventDto) {
    const updates: Record<string, unknown> = {};
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.startDate !== undefined) updates.start_date = dto.startDate;
    if (dto.endDate !== undefined) updates.end_date = dto.endDate;
    if (dto.location !== undefined) updates.location = dto.location;
    if (dto.category !== undefined) updates.category = dto.category;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.slug !== undefined) updates.slug = await this.ensureUniqueSlug(dto.slug, id);
    if (dto.coverMediaId !== undefined) updates.cover_media_id = dto.coverMediaId;
    if (dto.coverImageUrl !== undefined) {
      const mediaId = randomUUID();
      await this.knex('media_assets').insert({
        id: mediaId,
        file_name: dto.coverImageUrl.split('/').pop() ?? 'cover.jpg',
        url: dto.coverImageUrl,
      });
      updates.cover_media_id = mediaId;
    }
    const res = await this.table().where({ id }).update(updates);
    if (!res) throw new NotFoundException('Event not found');
    return this.findById(id);
  }

  async publish(id: string) {
    const res = await this.table().where({ id }).update({ status: 'published' });
    if (!res) throw new NotFoundException('Event not found');
    return this.findById(id);
  }

  async remove(id: string) {
    const res = await this.table().where({ id }).delete();
    if (!res) throw new NotFoundException('Event not found');
    return { success: true };
  }

  async findById(id: string) {
    const row = await this.withCoverUrl(this.table().where({ id }).first());
    if (!row) throw new NotFoundException('Event not found');
    return row;
  }
}


