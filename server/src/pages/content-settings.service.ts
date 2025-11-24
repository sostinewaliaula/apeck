import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';

import { KNEX_CONNECTION } from '../database/database.constants';

const RETENTION_KEY = 'trashRetentionDays';

@Injectable()
export class ContentSettingsService {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly configService: ConfigService,
  ) {}

  async getTrashRetentionDays(): Promise<number> {
    const row = await this.knex('content_settings')
      .where({ key: RETENTION_KEY })
      .first();
    if (row) {
      const parsed = parseInt(row.value, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
    return this.configService.get<number>('content.trashRetentionDays', 30);
  }

  async updateTrashRetentionDays(days: number): Promise<number> {
    const normalized = Math.max(days, 1);
    const existing = await this.knex('content_settings')
      .where({ key: RETENTION_KEY })
      .first();
    if (existing) {
      await this.knex('content_settings')
        .where({ key: RETENTION_KEY })
        .update({ value: String(normalized), updated_at: this.knex.fn.now() });
    } else {
      await this.knex('content_settings').insert({
        key: RETENTION_KEY,
        value: String(normalized),
      });
    }
    return normalized;
  }
}
