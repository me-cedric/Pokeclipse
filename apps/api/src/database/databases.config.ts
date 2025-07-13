import { ConfigType, registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  postgres: {
    url: process.env.DATABASE_URL!,
  },
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
