import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { RoutesModule } from './routes/routes.module';
import { MediaModule } from './media/media.module';
import { NewsModule } from './news/news.module';
import { EventsModule } from './events/events.module';
import { MembershipModule } from './membership/membership.module';
import { EmailRecipientsModule } from './email-recipients/email-recipients.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    PagesModule,
    RoutesModule,
    MediaModule,
    NewsModule,
    EventsModule,
    MembershipModule,
    EmailRecipientsModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
