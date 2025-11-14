import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';

import { KNEX_CONNECTION } from '../database/database.constants';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  listActiveRoutes() {
    return this.knex('routes').where({ is_active: true }).orderBy('slug');
  }

  async listAllRoutes() {
    return this.knex('routes').orderBy('created_at', 'desc');
  }

  async findById(id: string) {
    return this.knex('routes').where({ id }).first();
  }

  async createRoute(dto: CreateRouteDto) {
    const [route] = await this.knex('routes')
      .insert({
        slug: dto.slug,
        target: dto.target,
        is_active: dto.isActive,
      })
      .returning('*');
    return route;
  }

  async updateRoute(id: string, dto: UpdateRouteDto) {
    const updates: Record<string, unknown> = {};
    if (dto.slug !== undefined) updates.slug = dto.slug;
    if (dto.target !== undefined) updates.target = dto.target;
    if (dto.isActive !== undefined) updates.is_active = dto.isActive;

    const [route] = await this.knex('routes').where({ id }).update(updates).returning('*');
    return route;
  }

  async deleteRoute(id: string) {
    return this.knex('routes').where({ id }).delete();
  }
}

