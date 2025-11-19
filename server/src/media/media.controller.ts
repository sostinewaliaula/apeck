import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import type { Express } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MediaService } from './media.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  list() {
    return this.mediaService.listAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const destinationPath = join(process.cwd(), 'uploads');
          fs.mkdir(destinationPath, { recursive: true })
            .then(() => cb(null, destinationPath))
            .catch((err) => cb(err as Error, destinationPath));
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const extension = extname(file.originalname) || '.bin';
          cb(null, `${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (
          !file.mimetype.startsWith('image/') &&
          !file.mimetype.startsWith('video/')
        ) {
          cb(new Error('Only image or video uploads are supported'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText?: string,
  ) {
    if (!file) {
      throw new Error('File upload missing');
    }
    const urlPath = `/uploads/${file.filename}`;
    return this.mediaService.createAsset({
      fileName: file.filename,
      url: urlPath,
      mimeType: file.mimetype,
      altText,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.removeAsset(id);
  }
}
