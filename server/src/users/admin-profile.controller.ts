import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin/me')
export class AdminProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getProfile(@Req() req: Request) {
    const userId = (req.user as { sub?: string } | undefined)?.sub;
    return this.usersService.getProfile(userId);
  }

  @Patch()
  async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const userId = (req.user as { sub?: string } | undefined)?.sub;
    return this.usersService.updateSelfProfile(userId, dto);
  }

  @Patch('password')
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const userId = (req.user as { sub?: string } | undefined)?.sub;
    await this.usersService.changePassword(userId, dto.currentPassword, dto.newPassword);
    return { success: true };
  }
}

