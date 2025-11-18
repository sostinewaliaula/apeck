import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AdminEventsController } from './admin-events.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [EventsController, AdminEventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
