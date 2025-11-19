import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailRecipientsController } from './email-recipients.controller';
import { EmailRecipientsService } from './email-recipients.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EmailRecipientsController],
  providers: [EmailRecipientsService],
  exports: [EmailRecipientsService],
})
export class EmailRecipientsModule {}

