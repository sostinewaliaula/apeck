import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';

export type MediaAssetRow = {
  id: string;
  file_name: string;
  url: string;
  alt_text: string | null;
  mime_type: string | null;
  category: string | null;
  created_at?: Date;
  updated_at?: Date;
};

@Injectable()
export class MediaService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  listAll(): Promise<MediaAssetRow[]> {
    return this.knex<MediaAssetRow>('media_assets').orderBy(
      'created_at',
      'desc',
    );
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
  }): Promise<MediaAssetRow | undefined> {
    const id = uuid();
    const category = mimeType?.startsWith('video/') ? 'video' : 'image';

    await this.knex<MediaAssetRow>('media_assets').insert({
      id,
      file_name: fileName,
      url,
      alt_text: altText ?? null,
      mime_type: mimeType,
      category,
    });
    return this.knex<MediaAssetRow>('media_assets').where({ id }).first();
  }

  async removeAsset(id: string) {
    const asset = await this.knex<MediaAssetRow>('media_assets')
      .where({ id })
      .first();
    if (!asset) {
      throw new NotFoundException('Media asset not found');
    }
    await this.knex<MediaAssetRow>('media_assets').where({ id }).delete();
    if (asset.file_name) {
      const filePath = join(process.cwd(), 'uploads', asset.file_name);
      await fs.unlink(filePath).catch(() => {
        // ignore missing files
      });
    }
    return { success: true };
  }
}
