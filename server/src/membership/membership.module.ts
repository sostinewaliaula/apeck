import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { EmailRecipientsModule } from '../email-recipients/email-recipients.module';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  imports: [DatabaseModule, EmailModule, EmailRecipientsModule],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
