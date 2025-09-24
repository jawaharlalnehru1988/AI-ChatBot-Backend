import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import express from 'express';

let cachedApp;

async function createNestApp() {
  if (!cachedApp) {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    
    cachedApp = await NestFactory.create(AppModule, adapter);
    
    cachedApp.enableCors({
      origin: true, // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    
    cachedApp.useGlobalPipes(new ValidationPipe({whitelist: true}));
    await cachedApp.init();
  }
  return cachedApp;
}

// For local development
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  await app.listen(process.env.PORT ?? 4000);
}

// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  const app = await createNestApp();
  return app.getHttpAdapter().getInstance()(req, res);
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}
