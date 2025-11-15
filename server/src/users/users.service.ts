import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';

import { KNEX_CONNECTION } from '../database/database.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly passwordPepper: string;

  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
    private readonly configService: ConfigService,
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

  async createUser(payload: CreateUserDto): Promise<UserEntity> {
    const role: UserRole = payload.role ?? 'viewer';
    const password_hash = await this.hashPassword(payload.password);
    const [user] = await this.knex<UserEntity>('users')
      .insert({
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email.toLowerCase(),
        password_hash,
        role,
      })
      .returning('*');
    return user;
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
