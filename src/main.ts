import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyCookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(helmet as any, { contentSecurityPolicy: false } as any);

  await app.register(fastifyCookie as any, {
    secret: process.env.COOKIE_SECRET || 'dev-cookie-secret',
  } as any);

  await app.register(rateLimit as any, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(fastifyStatic as any, {
    root: join(__dirname, '..', 'public'),
    prefix: '/',
  });

  const rawOrigins = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean) || [
    'http://localhost:3000',
    'https://exobe-ecommerce.vercel.app',
    'https://exobe-api.vercel.app',
  ];

  const toMatcher = (o: string) => {
    if (o.includes('*')) {
      const pattern = o.replace(/[.+?^${}()|[\\]\\]/g, '\\$&').replace(/\\\*/g, '.*');
      return new RegExp(`^${pattern}$`);
    }
    return o;
  };
  const originMatchers = rawOrigins.map(toMatcher);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed = originMatchers.some((m) => (m instanceof RegExp ? m.test(origin) : m === origin));
      callback(allowed ? null : new Error('Not allowed by CORS'), allowed);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
    credentials: true,
    maxAge: 86400,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(4000, '0.0.0.0');
}
bootstrap();
