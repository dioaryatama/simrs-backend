import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // ✅ TAMBAH INI

const server = express();

// cache instance
let isInitialized = false;

const createNestServer = async () => {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.setGlobalPrefix('api/v2');
    app.enableCors();

    // ✅ SETUP SWAGGER DI SINI
    const config = new DocumentBuilder()
      .setTitle('SIMRS API')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);
    // hasilnya: /api/v2/docs

    await app.init();

    isInitialized = true;
  }
};

export default async (req: any, res: any) => {
  await createNestServer();
  return server(req, res);
};
