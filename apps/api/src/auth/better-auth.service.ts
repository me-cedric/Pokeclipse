import { Inject, Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { PostgresService } from 'src/database/postgres/postgres.service';
import { BetterAuthConfig, betterAuthConfig } from './better-auth.config';

@Injectable()
export class BetterAuthService {
  readonly basePath = '/auth/client';
  readonly client: ReturnType<typeof betterAuth>;

  constructor(
    @Inject(betterAuthConfig.KEY)
    private betterAuthConfig: BetterAuthConfig,
    private postgresService: PostgresService,
  ) {
    this.client = betterAuth({
      database: drizzleAdapter(this.postgresService.client, {
        provider: 'pg',
        schema: {
          ...this.postgresService.schema,
          user: this.postgresService.schema.users,
          account: this.postgresService.schema.accounts,
          session: this.postgresService.schema.sessions,
          verification: this.postgresService.schema.verifications,
        },
      }),
      // secret: this.betterAuthConfig.secret,
      // baseURL: this.betterAuthConfig.baseUrl,
      // basePath: this.basePath,
      trustedOrigins: this.betterAuthConfig.trustedOrigins,
      // advanced: {
      //   database: {
      //     generateId: false,
      //   },
      // },
      socialProviders: {
        discord: {
          clientId: process.env.DISCORD_CLIENT_ID!,
          clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
      },
    });
  }
}
