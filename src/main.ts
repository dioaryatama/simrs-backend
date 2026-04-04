import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // Hanya sebagai adapter/jembatan

// 1. Buat instance express sebagai 'container'
const server = express();

export const createNestServer = async (expressInstance) => {
  // 2. Masukkan expressInstance ke dalam NestJS lewat ExpressAdapter
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  // Semua config NestJS kamu tetap di sini
  app.setGlobalPrefix('api/v2');
  app.enableCors();

  // 3. PENTING: Gunakan init(), bukan listen()
  await app.init();
};

// 4. Export handler untuk dibaca oleh Vercel
export default async (req: any, res: any) => {
  await createNestServer(server);
  server(req, res);
};
