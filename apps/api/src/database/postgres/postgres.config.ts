import { ConfigType, registerAs } from '@nestjs/config';

export const postgresConfig = registerAs('postgres', () => ({
  url: process.env.DATABASE_URL!,
}));

export type PostgresConfig = ConfigType<typeof postgresConfig>;
