import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';
import {
  CreateEmailRecipientDto,
  RecipientType,
} from './dto/create-email-recipient.dto';
import { UpdateEmailRecipientDto } from './dto/update-email-recipient.dto';

type EmailRecipientRow = {
  id: string;
  email: string;
  name: string | null;
  type: RecipientType;
  is_active: number;
  display_order: number;
  created_at?: Date;
  updated_at?: Date;
};

@Injectable()
export class EmailRecipientsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findAll(type?: RecipientType): Promise<EmailRecipientRow[]> {
    let query = this.knex<EmailRecipientRow>('email_recipients');
    if (type) {
      query = query.where('type', type).andWhere('is_active', 1);
    } else {
      query = query.where('is_active', 1);
    }
    return await query
      .orderBy('display_order', 'asc')
      .orderBy('created_at', 'asc');
  }

  async findAllForAdmin(): Promise<EmailRecipientRow[]> {
    try {
      return await this.knex<EmailRecipientRow>('email_recipients')
        .orderBy('type', 'asc')
        .orderBy('display_order', 'asc')
        .orderBy('created_at', 'asc');
    } catch {
      // Table might not exist yet, return empty array
      return [];
    }
  }

  async findActiveByType(type: RecipientType): Promise<string[]> {
    try {
      const recipients = await this.knex<EmailRecipientRow>('email_recipients')
        .where('type', type)
        .andWhere('is_active', 1)
        .orderBy('display_order', 'asc')
        .orderBy('created_at', 'asc');
      return recipients.map((r) => r.email);
    } catch {
      // Table might not exist yet, return empty array
      return [];
    }
  }

  async findById(id: string): Promise<EmailRecipientRow | undefined> {
    return this.knex<EmailRecipientRow>('email_recipients')
      .where({ id })
      .first();
  }

  async create(dto: CreateEmailRecipientDto) {
    const id = uuid();
    await this.knex<EmailRecipientRow>('email_recipients').insert({
      id,
      email: dto.email,
      name: dto.name || null,
      type: dto.type,
      is_active: (dto.isActive ?? true) ? 1 : 0,
      display_order: dto.displayOrder ?? 0,
    });

    const created = await this.findById(id);
    if (!created) {
      throw new NotFoundException('Failed to load created email recipient');
    }

    return created;
  }

  async update(id: string, dto: UpdateEmailRecipientDto) {
    const updates: Record<string, unknown> = {};
    if (dto.email !== undefined) updates.email = dto.email;
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.type !== undefined) updates.type = dto.type;
    if (dto.isActive !== undefined) updates.is_active = dto.isActive ? 1 : 0;
    if (dto.displayOrder !== undefined)
      updates.display_order = dto.displayOrder;

    const affected = await this.knex<EmailRecipientRow>('email_recipients')
      .where({ id })
      .update(updates);
    if (!affected) {
      throw new NotFoundException('Email recipient not found');
    }

    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException('Email recipient not found');
    }

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.knex<EmailRecipientRow>('email_recipients')
      .where({ id })
      .delete();
    if (deleted === 0) {
      throw new NotFoundException('Email recipient not found');
    }
    return { success: true };
  }
}
