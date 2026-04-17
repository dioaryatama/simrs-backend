import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

// ✅ cache instance
let isInitialized = false;

const createNestServer = async () => {
  if (!isInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.setGlobalPrefix('api/v2');
    app.enableCors();

    await app.init();

    isInitialized = true;
  }
};

export default async (req: any, res: any) => {
  await createNestServer();
  return server(req, res);
};
