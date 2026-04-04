import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log','error','warn'] });
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v2');
  app.enableCors({ origin: config.get<string[]>('app.corsOrigins'), credentials: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  const swaggerCfg = new DocumentBuilder()
    .setTitle('SIMRS v2 API')
    .setDescription('Sistem Informasi Manajemen Rumah Sakit — REST API lengkap')
    .setVersion('2.0.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development')
    .build();

  SwaggerModule.setup('api/docs', app,
    SwaggerModule.createDocument(app, swaggerCfg),
    { swaggerOptions: { persistAuthorization: true } }
  );

  const port = config.get<number>('app.port') || 3000;
  await app.listen(port);
  console.log(`\n🏥 SIMRS v2 API  → http://localhost:${port}/api/v2`);
  console.log(`📚 Swagger Docs  → http://localhost:${port}/api/docs\n`);
}
bootstrap();
