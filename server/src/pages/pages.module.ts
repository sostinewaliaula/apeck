import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { AdminPagesController } from './admin-pages.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PagesController, AdminPagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}

