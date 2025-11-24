import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { AdminPagesController } from './admin-pages.controller';
import { PageCleanupService } from './page-cleanup.service';
import { ContentSettingsService } from './content-settings.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PagesController, AdminPagesController],
  providers: [PagesService, PageCleanupService, ContentSettingsService],
  exports: [PagesService],
})
export class PagesModule {}
