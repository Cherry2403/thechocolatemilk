import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — all routes under /api
  app.setGlobalPrefix('api');

  // CORS — allow frontend dev server
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Validation pipe — auto-transform query params & validate DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🌿 THE_CHOCOLATE_MILK backend running on http://localhost:${port}`);
}
bootstrap();
