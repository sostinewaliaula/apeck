import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { AdminUsersController } from './admin-users.controller';
import { AdminProfileController } from './admin-profile.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, EmailModule],
  providers: [UsersService],
  controllers: [AdminUsersController, AdminProfileController],
  exports: [UsersService],
})
export class UsersModule {}
