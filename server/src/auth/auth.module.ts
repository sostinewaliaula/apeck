import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PasswordResetService } from './password-reset.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    DatabaseModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    PasswordResetService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
