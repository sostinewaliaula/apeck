import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api', { exclude: [] });
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  const defaultOrigins = ['http://localhost:5173', 'http://localhost:4173'];
  const appUrl = configService.get<string>('app.url');
  const corsOrigins = appUrl
    ? Array.from(new Set([...defaultOrigins, appUrl]))
    : defaultOrigins;
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>('app.port', 4000);
  await app.listen(port);
}

bootstrap().catch((err) => {
  console.error('Failed to bootstrap server', err);
  process.exit(1);
});
