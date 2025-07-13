import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import getCorsOptions from '../cors';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.enableCors(getCorsOptions());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
