"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const configuration_1 = require("./config/configuration");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const patients_module_1 = require("./modules/patients/patients.module");
const registration_module_1 = require("./modules/registration/registration.module");
const emr_module_1 = require("./modules/emr/emr.module");
const inpatient_module_1 = require("./modules/inpatient/inpatient.module");
const pharmacy_module_1 = require("./modules/pharmacy/pharmacy.module");
const core_module_1 = require("./modules/core/core.module");
const finance_module_1 = require("./modules/finance/finance.module");
const hr_module_1 = require("./modules/hr/hr.module");
const auth_guard_1 = require("./common/guards/auth.guard");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const interceptors_1 = require("./common/interceptors");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.appConfig, configuration_1.dbConfig, configuration_1.jwtConfig, configuration_1.bpjsConfig],
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([{ name: 'short', ttl: 60000, limit: 100 }]),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            patients_module_1.PatientsModule,
            registration_module_1.RegistrationModule,
            emr_module_1.EmrModule,
            inpatient_module_1.InpatientModule,
            pharmacy_module_1.PharmacyModule,
            core_module_1.CoreModules,
            finance_module_1.FinanceModule,
            hr_module_1.HrInventoryModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_FILTER, useClass: global_exception_filter_1.GlobalExceptionFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: interceptors_1.LoggingInterceptor },
            { provide: core_1.APP_INTERCEPTOR, useClass: interceptors_1.TransformInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map