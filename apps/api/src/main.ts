/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));

  const globalPrefix = 'api';
  app.enableCors();
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;

  // Création de  la docmentation de l'api
  const options = new DocumentBuilder()
    .setTitle('Foto Api')
    .setDescription('Documentation de la foto API par barna')
    .setVersion('1.0')
    .addTag('album')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  // Helmet pour la sécurité
  app.use(helmet());

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
