import { Controller, Get, Param } from '@nestjs/common';

import { PagesService } from './pages.service';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.pagesService.findPublishedPage(slug);
  }

  @Get()
  listRoutes() {
    return this.pagesService.listRoutes();
  }
}
