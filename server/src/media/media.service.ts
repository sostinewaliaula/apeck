import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';

@Injectable()
export class MediaService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  listAll() {
    return this.knex('media_assets').orderBy('created_at', 'desc');
  }

  async createAsset({
    fileName,
    url,
    mimeType,
    altText,
  }: {
    fileName: string;
    url: string;
    mimeType: string;
    altText?: string;
  }) {
    const id = uuid();
    await this.knex('media_assets').insert({
      id,
      file_name: fileName,
      url,
      alt_text: altText ?? null,
      mime_type: mimeType,
      category: 'image',
    });
    return this.knex('media_assets').where({ id }).first();
  }

  async removeAsset(id: string) {
    const asset = await this.knex('media_assets').where({ id }).first();
    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }
    await this.knex('media_assets').where({ id }).delete();
    if (asset.file_name) {
      const filePath = join(process.cwd(), 'uploads', asset.file_name);
      await fs
        .unlink(filePath)
        .catch(() => {
          // ignore missing files
        });
    }
    return { success: true };
  }
}

