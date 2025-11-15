import { Controller, Get, Param, Query } from '@nestjs/common';

import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  listPublic(
    @Query('featured') featured?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.newsService.listPublicNews({
      featuredOnly: featured === 'true',
      limit: Number.isFinite(parsedLimit) ? parsedLimit : undefined,
    });
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.newsService.getPublishedBySlug(slug);
  }
}
