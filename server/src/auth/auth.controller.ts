import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { UsersService } from '../users/users.service';
import { AuthService, type AuthResult, type TokenBundle } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordResetService } from './password-reset.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResult> {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const metadata = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    };
    const result = await this.authService.login(user, metadata);

    console.log('[AUTH] Successful login', {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
    });
    return result;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<TokenBundle> {
    const payload = req.user as { sub: string; sid: string; token: string };

    console.log('[AUTH] Refresh token request', {
      userId: payload.sub,
      sessionId: payload.sid,
    });
    return this.authService.refresh(payload.sub, payload.sid, payload.token);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const payload = req.user as { sub: string; sid: string; token: string };

    console.log('[AUTH] Logout request', {
      userId: payload.sub,
      sessionId: payload.sid,
    });
    await this.authService.logout(payload.sub, payload.sid);
    return { success: true };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    await this.passwordResetService.requestReset(dto.email, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    return {
      success: true,
      message: 'If that email exists, a reset code has been sent.',
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.passwordResetService.resetPassword(
      dto.email,
      dto.code,
      dto.newPassword,
    );
    return { success: true };
  }
}
