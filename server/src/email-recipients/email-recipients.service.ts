import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';
import { CreateEmailRecipientDto, RecipientType } from './dto/create-email-recipient.dto';
import { UpdateEmailRecipientDto } from './dto/update-email-recipient.dto';

@Injectable()
export class EmailRecipientsService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async findAll(type?: RecipientType) {
    let query = this.knex('email_recipients');
    if (type) {
      query = query.where({ type, is_active: true });
    } else {
      query = query.where({ is_active: true });
    }
    return query.orderBy('display_order', 'asc').orderBy('created_at', 'asc');
  }

  async findAllForAdmin() {
    try {
      return await this.knex('email_recipients').orderBy('type', 'asc').orderBy('display_order', 'asc').orderBy('created_at', 'asc');
    } catch (error) {
      // Table might not exist yet, return empty array
      return [];
    }
  }

  async findActiveByType(type: RecipientType): Promise<string[]> {
    try {
      const recipients = await this.knex('email_recipients')
        .where({ type, is_active: true })
        .orderBy('display_order', 'asc')
        .orderBy('created_at', 'asc');
      return recipients.map((r) => r.email);
    } catch (error) {
      // Table might not exist yet, return empty array
      return [];
    }
  }

  async findById(id: string) {
    return this.knex('email_recipients').where({ id }).first();
  }

  async create(dto: CreateEmailRecipientDto) {
    const id = uuid();
    const [recipient] = await this.knex('email_recipients')
      .insert({
        id,
        email: dto.email,
        name: dto.name || null,
        type: dto.type,
        is_active: dto.isActive ?? true,
        display_order: dto.displayOrder ?? 0,
      })
      .returning('*');
    return recipient;
  }

  async update(id: string, dto: UpdateEmailRecipientDto) {
    const updates: Record<string, unknown> = {};
    if (dto.email !== undefined) updates.email = dto.email;
    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.type !== undefined) updates.type = dto.type;
    if (dto.isActive !== undefined) updates.is_active = dto.isActive;
    if (dto.displayOrder !== undefined) updates.display_order = dto.displayOrder;

    const [recipient] = await this.knex('email_recipients')
      .where({ id })
      .update(updates)
      .returning('*');
    
    if (!recipient) {
      throw new NotFoundException('Email recipient not found');
    }
    
    return recipient;
  }

  async delete(id: string) {
    const deleted = await this.knex('email_recipients').where({ id }).delete();
    if (deleted === 0) {
      throw new NotFoundException('Email recipient not found');
    }
    return { success: true };
  }
}

