import { Module } from '@nestjs/common';

import { KNEX_CONNECTION } from './database.constants';
import { KnexService } from './knex.service';

@Module({
  providers: [
    KnexService,
    {
      provide: KNEX_CONNECTION,
      inject: [KnexService],
      useFactory: (knexService: KnexService) => knexService.connection,
    },
  ],
  exports: [KNEX_CONNECTION, KnexService],
})
export class DatabaseModule {}
