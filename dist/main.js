"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const swagger_1 = require("@nestjs/swagger");
const server = (0, express_1.default)();
let isInitialized = false;
const createNestServer = async () => {
    if (!isInitialized) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
        app.setGlobalPrefix('api/v2');
        app.enableCors();
        const config = new swagger_1.DocumentBuilder()
            .setTitle('SIMRS API')
            .setDescription('API Documentation')
            .setVersion('1.0')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document);
        await app.init();
        isInitialized = true;
    }
};
exports.default = async (req, res) => {
    await createNestServer();
    return server(req, res);
};
//# sourceMappingURL=main.js.map