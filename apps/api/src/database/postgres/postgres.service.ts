import { Inject, Injectable } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DatabaseConfig, databaseConfig } from '../databases.config';
import * as drizzleSchema from './postgres.schema.js';

@Injectable()
export class PostgresService {
  client: NodePgDatabase<typeof drizzleSchema>;
  schema = drizzleSchema;

  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: DatabaseConfig,
  ) {
    this.client = drizzle(this.dbConfig.postgres.url, {
      schema: drizzleSchema,
    });
  }
}
