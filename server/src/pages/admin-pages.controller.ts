import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PagesService } from './pages.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('editor', 'admin')
@Controller('admin/pages')
export class AdminPagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  list(@Query('slug') slug?: string) {
    return this.pagesService.listPages(slug ? { slug } : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findPageById(id);
  }

  @Post()
  create(@Body() dto: CreatePageDto) {
    return this.pagesService.createPage(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePageDto) {
    return this.pagesService.updatePage(id, dto);
  }

  @Post(':id/publish')
  publish(@Param('id') id: string) {
    return this.pagesService.publishPage(id);
  }

  @Post(':id/sections')
  addSection(@Param('id') id: string, @Body() dto: CreateSectionDto) {
    return this.pagesService.createSection(id, dto);
  }

  @Patch('sections/:sectionId')
  updateSection(
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.pagesService.updateSection(sectionId, dto);
  }

  @Delete('sections/:sectionId')
  removeSection(@Param('sectionId') sectionId: string) {
    return this.pagesService.deleteSection(sectionId);
  }
}
