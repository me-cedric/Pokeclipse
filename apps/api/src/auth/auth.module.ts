import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { toNodeHandler } from 'better-auth/node';
import { DatabasesModule } from '../database/databases.module';
import { AuthController } from './auth.controller';
import { betterAuthConfig } from './better-auth.config';
import { BetterAuthService } from './better-auth.service';

export const AUTH_INSTANCE_KEY = 'AUTH_INSTANCE';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [betterAuthConfig],
    }),
    DatabasesModule,
  ],
  providers: [BetterAuthService],
  controllers: [AuthController],
  exports: [BetterAuthService],
})
export class AuthModule {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly betterAuthService: BetterAuthService,
  ) {
    this.adapter.httpAdapter.all(
      `${this.betterAuthService.basePath}/{*any}`,
      toNodeHandler(betterAuthService.client),
    );
  }
}
