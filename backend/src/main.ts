import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import dataSource from './data-source';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use('/uploads', express.static('uploads'));

  app.enableCors({
    origin: 'http://localhost:3000',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  dataSource.initialize()
  .then(() => console.log("Data Source has been initialized!"))
  .catch((err) => console.error("Error during Data Source initialization", err));

  await app.listen(3001);
}
bootstrap();