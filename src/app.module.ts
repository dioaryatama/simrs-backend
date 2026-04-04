import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { appConfig, dbConfig, jwtConfig, bpjsConfig } from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { EmrModule } from './modules/emr/emr.module';
import { InpatientModule } from './modules/inpatient/inpatient.module';
import { PharmacyModule } from './modules/pharmacy/pharmacy.module';
import { CoreModules } from './modules/core/core.module';
import { FinanceModule } from './modules/finance/finance.module';
import { HrInventoryModule } from './modules/hr/hr.module';
import { JwtAuthGuard } from './common/guards/auth.guard';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor, TransformInterceptor } from './common/interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, jwtConfig, bpjsConfig],
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{ name: 'short', ttl: 60000, limit: 100 }]),
    DatabaseModule,
    AuthModule,
    PatientsModule,
    RegistrationModule,
    EmrModule,
    InpatientModule,
    PharmacyModule,
    CoreModules,
    FinanceModule,
    HrInventoryModule,
  ],
  providers: [
    { provide: APP_GUARD,       useClass: JwtAuthGuard },
    { provide: APP_GUARD,       useClass: ThrottlerGuard },
    { provide: APP_FILTER,      useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
