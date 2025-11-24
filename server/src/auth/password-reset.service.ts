import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

import { KNEX_CONNECTION } from '../database/database.constants';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

interface ResetMetadata {
  ipAddress?: string | null;
  userAgent?: string | string[] | undefined;
}

interface PasswordResetRow {
  id: string;
  user_id: string;
  code_hash: string;
  plain_preview: string | null;
  expires_at: Date | string;
  used_at: Date | string | null;
}

@Injectable()
export class PasswordResetService {
  private readonly codeLength = 6;
  private readonly expiryMinutes: number;

  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    configService: ConfigService,
  ) {
    this.expiryMinutes =
      Number(configService.get('auth.resetCodeExpiryMinutes')) || 15;
  }

  async requestReset(email: string, metadata: ResetMetadata = {}) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Do not reveal if user exists
      return { success: true };
    }

    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + this.expiryMinutes * 60 * 1000);

    await this.knex('password_reset_tokens').insert({
      id: uuid(),
      user_id: user.id,
      code_hash: codeHash,
      plain_preview: code,
      expires_at: expiresAt,
      request_ip: metadata.ipAddress ?? null,
      user_agent:
        typeof metadata.userAgent === 'string' ? metadata.userAgent : null,
      used_at: null,
    });

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'Reset your APECK Admin password',
      html: `
        <p>Hello ${user.first_name},</p>
        <p>We received a request to reset your APECK Admin password. Use the code below to complete the process:</p>
        <p style="font-size: 24px; font-weight: bold;">${code}</p>
        <p>This code expires in ${this.expiryMinutes} minutes. If you didn’t request this, you can ignore this email.</p>
      `,
    });

    return { success: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid reset code');
    }

    const token = await this.knex<PasswordResetRow>('password_reset_tokens')
      .where({ user_id: user.id })
      .whereNull('used_at')
      .orderBy('created_at', 'desc')
      .first();

    if (!token) {
      throw new BadRequestException('Reset code has expired');
    }

    const expiresAtValue =
      token.expires_at instanceof Date
        ? token.expires_at
        : new Date(
            `${token.expires_at}${
              typeof token.expires_at === 'string' &&
              !token.expires_at.endsWith('Z')
                ? 'Z'
                : ''
            }`,
          );

    if (expiresAtValue.getTime() < Date.now()) {
      throw new BadRequestException('Reset code has expired');
    }

    const valid = await bcrypt.compare(code, token.code_hash);
    if (!valid) {
      throw new BadRequestException('Invalid reset code');
    }

    await this.usersService.forcePasswordUpdate(user.id, newPassword);

    await this.knex('password_reset_tokens')
      .where({ id: token.id })
      .update({ used_at: this.knex.fn.now() });

    return { success: true };
  }

  private generateCode(): string {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < this.codeLength; i += 1) {
      const idx = Math.floor(Math.random() * digits.length);
      result += digits[idx];
    }
    return result;
  }
}
