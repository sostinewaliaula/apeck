import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { AdminNewsController } from './admin-news.controller';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsController, AdminNewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}

