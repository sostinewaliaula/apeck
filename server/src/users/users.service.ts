import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';
import { EmailService } from '../email/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserEntity, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly passwordPepper: string;

  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.passwordPepper = this.configService.get<string>(
      'security.passwordPepper',
      '',
    );
  }

  private hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(`${plain}${this.passwordPepper}`, 12);
  }

  private comparePassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(`${plain}${this.passwordPepper}`, hash);
  }

  async hashPasswordInternal(plain: string): Promise<string> {
    return this.hashPassword(plain);
  }

  private mapUser(user: UserEntity) {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      isActive: Boolean(user.is_active),
      lastLoginAt: user.last_login_at ?? undefined,
      createdAt: user.created_at ?? undefined,
      updatedAt: user.updated_at ?? undefined,
    };
  }

  private ensureUserId(userId?: string): string {
    if (!userId) {
      throw new BadRequestException('User context missing');
    }
    return userId;
  }

  private generateTemporaryPassword(): string {
    return crypto
      .randomBytes(9)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 12);
  }

  private async requireAnotherAdmin(currentUserId: string): Promise<void> {
    const result = await this.knex('users')
      .where({ role: 'admin', is_active: 1 })
      .whereNot({ id: currentUserId })
      .count<{ count: string }>('id as count');

    const remainingAdmins = Number(result[0]?.count ?? 0);

    if (remainingAdmins === 0) {
      throw new BadRequestException(
        'At least one active admin user is required.',
      );
    }
  }

  async createUser(payload: CreateUserDto) {
    const role: UserRole = payload.role ?? 'viewer';
    const password_hash = await this.hashPassword(payload.password);
    const id = uuid();
    await this.knex<UserEntity>('users').insert({
      id,
      first_name: payload.firstName,
      last_name: payload.lastName,
      email: payload.email.toLowerCase(),
      password_hash,
      role,
    });
    const created = await this.findById(id);
    if (!created) {
      throw new NotFoundException('Failed to create user');
    }
    const mapped = this.mapUser(created);

    const shouldSendInvite = payload.sendInvite ?? true;
    if (shouldSendInvite) {
      await this.sendInvitationEmail(mapped, payload.password).catch(
        (error) => {
          this.logger.error('Failed to send user invitation email', error);
        },
      );
    }

    return mapped;
  }

  async listAdminUsers() {
    const users = await this.knex<UserEntity>('users')
      .select('*')
      .orderBy('created_at', 'desc');
    return users.map((user) => this.mapUser(user));
  }

  async updateAdminUser(id: string, payload: UpdateUserDto) {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const update: Partial<UserEntity> = {};

    if (payload.firstName !== undefined) {
      update.first_name = payload.firstName;
    }
    if (payload.lastName !== undefined) {
      update.last_name = payload.lastName;
    }
    if (payload.email !== undefined) {
      update.email = payload.email.toLowerCase();
    }
    if (payload.role !== undefined) {
      if (existing.role === 'admin' && payload.role !== 'admin') {
        await this.requireAnotherAdmin(existing.id);
      }
      update.role = payload.role;
    }
    if (payload.isActive !== undefined) {
      if (
        existing.role === 'admin' &&
        existing.is_active &&
        payload.isActive === false
      ) {
        await this.requireAnotherAdmin(existing.id);
      }
      update.is_active = payload.isActive ? 1 : 0;
    }
    if (payload.password) {
      update.password_hash = await this.hashPassword(payload.password);
    }

    if (Object.keys(update).length === 0) {
      return this.mapUser(existing);
    }

    await this.knex<UserEntity>('users').where({ id }).update(update);
    const fresh = await this.findById(id);
    if (!fresh) {
      throw new NotFoundException('User not found after update');
    }
    return this.mapUser(fresh);
  }

  async getProfile(userId?: string) {
    const id = this.ensureUserId(userId);
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapUser(user);
  }

  async updateSelfProfile(
    userId: string | undefined,
    payload: UpdateProfileDto,
  ) {
    const id = this.ensureUserId(userId);
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const update: Partial<UserEntity> = {};

    if (payload.firstName !== undefined) {
      update.first_name = payload.firstName;
    }
    if (payload.lastName !== undefined) {
      update.last_name = payload.lastName;
    }
    if (payload.email !== undefined) {
      const targetEmail = payload.email.toLowerCase();
      if (targetEmail !== existing.email) {
        const otherUser = await this.findByEmail(targetEmail);
        if (otherUser && otherUser.id !== id) {
          throw new BadRequestException('Email already in use');
        }
      }
      update.email = targetEmail;
    }

    if (Object.keys(update).length === 0) {
      return this.mapUser(existing);
    }

    await this.knex<UserEntity>('users').where({ id }).update(update);
    const fresh = await this.findById(id);
    if (!fresh) {
      throw new NotFoundException('User not found');
    }
    return this.mapUser(fresh);
  }

  async changePassword(
    userId: string | undefined,
    currentPassword: string,
    newPassword: string,
  ) {
    const id = this.ensureUserId(userId);
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await this.comparePassword(
      currentPassword,
      user.password_hash,
    );
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const password_hash = await this.hashPassword(newPassword);
    await this.knex<UserEntity>('users')
      .where({ id })
      .update({ password_hash });
  }

  async forcePasswordUpdate(userId: string, newPassword: string) {
    const password_hash = await this.hashPassword(newPassword);
    await this.knex<UserEntity>('users')
      .where({ id: userId })
      .update({ password_hash });
    await this.knex('user_sessions').where({ user_id: userId }).delete();
  }

  private async sendInvitationEmail(
    user: ReturnType<typeof this.mapUser>,
    tempPassword: string,
  ) {
    const frontendUrl = this.configService.get<string>(
      'app.frontendUrl',
      'http://localhost:5173',
    );
    const trimmedFrontend = frontendUrl.replace(/\/+$/, '');
    const adminUrl = `${trimmedFrontend}/admin`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f1f1f;">
        <h2 style="color:#8B2332;">Welcome to the APECK Admin Portal</h2>
        <p>Hello ${user.firstName},</p>
        <p>You have been invited to manage content on the APECK website. Use the credentials below to sign in:</p>
        <ul>
          <li><strong>Website:</strong> <a href="${trimmedFrontend}">${trimmedFrontend}</a></li>
          <li><strong>Admin Portal:</strong> <a href="${adminUrl}">${adminUrl}</a></li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Temporary Password:</strong> ${tempPassword}</li>
        </ul>
        <p>For security, please sign in and change your password from the “My Profile” page as soon as possible.</p>
        <p style="margin-top:30px;">Regards,<br/>APECK Team</p>
      </div>
    `;

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'APECK Admin Portal Invitation',
      html,
    });
  }

  async resendInvitation(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const tempPassword = this.generateTemporaryPassword();
    const password_hash = await this.hashPassword(tempPassword);
    await this.knex<UserEntity>('users')
      .where({ id: userId })
      .update({ password_hash, updated_at: this.knex.fn.now() });

    const updated = await this.findById(userId);
    if (!updated) {
      throw new NotFoundException('User not found');
    }

    await this.sendInvitationEmail(this.mapUser(updated), tempPassword);
  }

  async ensureAdminUser(): Promise<void> {
    const adminCountResult = await this.knex('users')
      .where({ role: 'admin' })
      .first();
    if (!adminCountResult) {
      this.logger.warn(
        'No admin user detected. Please create one via POST /users or seed script before enabling admin portal.',
      );
    }
  }

  findByEmail(email: string): Promise<UserEntity | undefined> {
    return this.knex<UserEntity>('users')
      .where({ email: email.toLowerCase() })
      .first();
  }

  findById(id: string): Promise<UserEntity | undefined> {
    return this.knex<UserEntity>('users').where({ id }).first();
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.is_active) {
      return null;
    }
    const isValid = await this.comparePassword(password, user.password_hash);
    return isValid ? user : null;
  }

  async recordLogin(userId: string): Promise<void> {
    await this.knex('users')
      .where({ id: userId })
      .update({ last_login_at: this.knex.fn.now() });
  }
}
