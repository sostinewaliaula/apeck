import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Knex } from 'knex';
import ms, { type StringValue } from 'ms';
import { v4 as uuid } from 'uuid';

import { KNEX_CONNECTION } from '../database/database.constants';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

interface SessionMetadata {
  userAgent?: string;
  ipAddress?: string;
}

export interface TokenBundle {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResult extends TokenBundle {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserEntity['role'];
  };
}

@Injectable()
export class AuthService {
  private readonly jwtSecrets: { access: string; refresh: string };

  private readonly jwtTtls: { access: StringValue; refresh: StringValue };

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(KNEX_CONNECTION) private readonly knex: Knex,
  ) {
    const accessSecret = this.configService.get<string>('jwt.accessSecret');
    const refreshSecret = this.configService.get<string>('jwt.refreshSecret');
    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not configured.');
    }
    this.jwtSecrets = {
      access: accessSecret,
      refresh: refreshSecret,
    };
    const accessTtl = (this.configService.get<string>('jwt.accessTtl', '900s') ?? '900s') as StringValue;
    const refreshTtl = (this.configService.get<string>('jwt.refreshTtl', '7d') ?? '7d') as StringValue;
    this.jwtTtls = {
      access: accessTtl,
      refresh: refreshTtl,
    };
  }

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    return this.usersService.validateCredentials(email, password);
  }

  async login(user: UserEntity, metadata: SessionMetadata): Promise<AuthResult> {
    await this.usersService.recordLogin(user.id);
    const tokens = await this.issueTokens(user, metadata);
    return {
      ...tokens,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(userId: string, sessionId: string, token: string): Promise<TokenBundle> {
    // eslint-disable-next-line no-console
    console.log('[AUTH] Refresh called', { userId, sessionId });
    const session = await this.knex('user_sessions').where({ id: sessionId, user_id: userId }).first();
    if (!session || new Date(session.expires_at) < new Date()) {
      // eslint-disable-next-line no-console
      console.warn('[AUTH] Session expired or missing', { sessionId, userId });
      throw new UnauthorizedException('Session expired');
    }

    const tokenValid = await bcrypt.compare(token, session.refresh_token_hash);
    if (!tokenValid) {
      await this.knex('user_sessions').where({ id: sessionId }).delete();
      // eslint-disable-next-line no-console
      console.warn('[AUTH] Invalid refresh token hash compare failed', { sessionId, userId });
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      // eslint-disable-next-line no-console
      console.warn('[AUTH] Refresh user not found', { userId });
      throw new UnauthorizedException('User not found');
    }

    await this.knex('user_sessions').where({ id: sessionId }).delete();
    return this.issueTokens(user, { userAgent: session.user_agent, ipAddress: session.ip_address });
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('[AUTH] Logout called', { userId, sessionId });
    await this.knex('user_sessions').where({ id: sessionId, user_id: userId }).delete();
  }

  private async issueTokens(user: UserEntity, metadata: SessionMetadata): Promise<TokenBundle> {
    const sessionId = uuid();
    const payload = { sub: user.id, role: user.role };
    // eslint-disable-next-line no-console
    console.log('[AUTH] Issuing tokens', { userId: user.id, sessionId, role: user.role });

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecrets.access,
      expiresIn: this.jwtTtls.access,
    });

    const refreshPayload = { sub: user.id, sid: sessionId, role: user.role };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.jwtSecrets.refresh,
      expiresIn: this.jwtTtls.refresh,
    });

    await this.persistSession({
      sessionId,
      userId: user.id,
      refreshToken,
      metadata,
    });
    // eslint-disable-next-line no-console
    console.log('[AUTH] Session persisted', { sessionId, userId: user.id });

    const expiresIn = this.ttlStringToSeconds(this.jwtTtls.access);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  private async persistSession({
    sessionId,
    userId,
    refreshToken,
    metadata,
  }: {
    sessionId: string;
    userId: string;
    refreshToken: string;
    metadata: SessionMetadata;
  }): Promise<void> {
    const refreshTtlMs = this.ttlStringToMs(this.jwtTtls.refresh);
    const expiresAt = new Date(Date.now() + refreshTtlMs);
    const hash = await bcrypt.hash(refreshToken, 12);
    await this.knex('user_sessions').insert({
      id: sessionId,
      user_id: userId,
      refresh_token_hash: hash,
      user_agent: metadata.userAgent ?? null,
      ip_address: metadata.ipAddress ?? null,
      expires_at: expiresAt,
    });
  }

  private ttlStringToMs(ttl: StringValue): number {
    const parsed = ms(ttl);
    if (typeof parsed !== 'number') {
      throw new Error(`Invalid TTL format: ${ttl}`);
    }
    return parsed;
  }

  private ttlStringToSeconds(ttl: StringValue): number {
    return this.ttlStringToMs(ttl) / 1000;
  }
}

