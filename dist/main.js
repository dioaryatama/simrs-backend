"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: ['log', 'error', 'warn'] });
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api/v2');
    app.enableCors({ origin: config.get('app.corsOrigins'), credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const swaggerCfg = new swagger_1.DocumentBuilder()
        .setTitle('SIMRS v2 API')
        .setDescription('Sistem Informasi Manajemen Rumah Sakit — REST API lengkap')
        .setVersion('2.0.0')
        .addBearerAuth()
        .addServer('http://localhost:3000', 'Development')
        .build();
    swagger_1.SwaggerModule.setup('api/docs', app, swagger_1.SwaggerModule.createDocument(app, swaggerCfg), { swaggerOptions: { persistAuthorization: true } });
    const port = config.get('app.port') || 3000;
    await app.listen(port);
    console.log(`\n🏥 SIMRS v2 API  → http://localhost:${port}/api/v2`);
    console.log(`📚 Swagger Docs  → http://localhost:${port}/api/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map