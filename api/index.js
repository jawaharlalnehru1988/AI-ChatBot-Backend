const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');

let app;

module.exports = async (req, res) => {
  // Set CORS headers immediately for preflight requests - Allow ALL headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS,HEAD');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!app) {
    app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: true, // Allow all origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: '*', // Allow all headers including custom ones
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 200,
      maxAge: 86400
    });
    
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  }
  
  return app.getHttpAdapter().getInstance()(req, res);
};