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
  const frontendUrl = configService.get<string>('app.frontendUrl');

  // Build allowed origins list
  const corsOrigins: string[] = [...defaultOrigins];
  if (appUrl) {
    corsOrigins.push(appUrl);
    // Also add HTTPS version if URL is HTTP
    if (appUrl.startsWith('http://')) {
      corsOrigins.push(appUrl.replace('http://', 'https://'));
    }
  }
  if (frontendUrl) {
    corsOrigins.push(frontendUrl);
  }

  // Remove duplicates
  const uniqueOrigins = Array.from(new Set(corsOrigins));

  // Log allowed origins for debugging
  console.log('[CORS] Allowed origins:', uniqueOrigins);

  app.enableCors({
    origin: uniqueOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
