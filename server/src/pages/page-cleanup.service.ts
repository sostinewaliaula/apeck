import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PagesService } from './pages.service';
import { ContentSettingsService } from './content-settings.service';

@Injectable()
export class PageCleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PageCleanupService.name);
  private interval: NodeJS.Timeout | null = null;

  constructor(
    private readonly pagesService: PagesService,
    private readonly contentSettingsService: ContentSettingsService,
  ) {}

  async onModuleInit() {
    await this.runCleanup();
    const oneDayMs = 24 * 60 * 60 * 1000;
    this.interval = setInterval(() => {
      this.runCleanup().catch((error) => {
        this.logger.error('Failed to run page cleanup', error);
      });
    }, oneDayMs);
  }

  onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async runCleanup() {
    const days = await this.contentSettingsService.getTrashRetentionDays();
    await this.pagesService.purgeDeletedPages(days);
    this.logger.debug(`Purged trashed pages older than ${days} days`);
  }
}
