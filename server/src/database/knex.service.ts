import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class KnexService implements OnModuleDestroy {
  private readonly knexInstance: Knex;

  constructor(private readonly configService: ConfigService) {
    const dbConfig = this.configService.get('database');
    this.knexInstance = knex({
      client: 'mysql2',
      connection: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.name,
        timezone: 'Z',
        dateStrings: true,
      },
      pool: { min: 2, max: 10 },
    });
  }

  get connection(): Knex {
    return this.knexInstance;
  }

  async onModuleDestroy(): Promise<void> {
    await this.knexInstance.destroy();
  }
}

