import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));
  
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS OpenAI & System Design API')
    .setDescription('API documentation for OpenAI integration, LiveKit, and System Design resources')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: '*', // Allow all headers including bypass-tunnel-reminder
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
    maxAge: 86400 // Cache preflight requests for 24 hours
  });
  
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  
  // Log server URLs
  console.log('');
  console.log('🚀 Server is running!');
  console.log('');
  console.log(`📍 Application: http://localhost:${port}`);
  console.log(`📚 Swagger API Documentation: http://localhost:${port}/api`);
  console.log('');
}

bootstrap();
