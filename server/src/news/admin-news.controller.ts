import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  CreateNewsDto,
  NEWS_STATUS_VALUES,
  NewsStatus,
} from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@UseGuards(JwtAuthGuard)
@Controller('admin/news')
export class AdminNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  list(
    @Query('status') status?: string,
    @Query('showOnHome') showOnHome?: string,
    @Query('search') search?: string,
  ) {
    const statusFilter = NEWS_STATUS_VALUES.includes(status as NewsStatus)
      ? (status as NewsStatus)
      : undefined;

    return this.newsService.listAdminNews({
      status: statusFilter,
      showOnHome,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findAdminById(id);
  }

  @Post()
  create(@Body() dto: CreateNewsDto, @Req() req: Request) {
    const userId = (req.user as { sub?: string } | undefined)?.sub;
    return this.newsService.createNews(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return this.newsService.updateNews(id, dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.newsService.publishNews(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.deleteNews(id);
  }
}
