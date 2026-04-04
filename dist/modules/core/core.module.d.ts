import { DataSource } from 'typeorm';
export declare class GenerateInvoiceDto {
    visitId: string;
    notes?: string;
}
export declare class AddPaymentDto {
    invoiceId: string;
    paymentMethod: string;
    amount: number;
    referenceNo?: string;
    bankName?: string;
    notes?: string;
}
export declare class BillingService {
    private ds;
    constructor(ds: DataSource);
    generateInvoice(dto: GenerateInvoiceDto, userId: string): Promise<{
        invoiceId: any;
        invoiceNo: string;
        total: any;
        message: string;
    }>;
    getInvoice(id: string): Promise<any>;
    getInvoices(status?: string, patientId?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<any>;
    addPayment(dto: AddPaymentDto, userId: string): Promise<{
        paymentNo: string;
        message: string;
        remaining: number;
    }>;
    voidPayment(payId: string, reason: string, userId: string): Promise<{
        message: string;
    }>;
    getOutstanding(payerId?: string, aging?: string): Promise<any>;
}
export declare class BillingController {
    private readonly svc;
    constructor(svc: BillingService);
    generate(dto: GenerateInvoiceDto, uid: string): Promise<{
        invoiceId: any;
        invoiceNo: string;
        total: any;
        message: string;
    }>;
    list(s?: string, p?: string, sd?: string, ed?: string, pg?: number, lm?: number): Promise<any>;
    outstanding(p?: string, a?: string): Promise<any>;
    detail(id: string): Promise<any>;
    pay(dto: AddPaymentDto, uid: string): Promise<{
        paymentNo: string;
        message: string;
        remaining: number;
    }>;
    void(id: string, r: string, uid: string): Promise<{
        message: string;
    }>;
}
export declare class BpjsService {
    private ds;
    constructor(ds: DataSource);
    createSEP(body: any, userId: string): Promise<any>;
    getSEPs(startDate?: string, endDate?: string, status?: string): Promise<any>;
    checkEligibility(bpjsNo: string): Promise<{
        bpjsNo: string;
        patient: any;
        eligible: boolean;
        message: string;
        note: string;
    }>;
    getSEPSummary(month: number, year: number): Promise<any>;
}
export declare class BpjsController {
    private readonly svc;
    constructor(svc: BpjsService);
    createSEP(body: any, uid: string): Promise<any>;
    getSEPs(s?: string, e?: string): Promise<any>;
    summary(m: number, y: number): Promise<any>;
    check(no: string): Promise<{
        bpjsNo: string;
        patient: any;
        eligible: boolean;
        message: string;
        note: string;
    }>;
}
export declare class MasterService {
    private ds;
    constructor(ds: DataSource);
    getDoctors(search?: string, specializationCode?: string, clinicId?: string): Promise<any>;
    getDoctorSchedules(doctorId?: string, clinicId?: string, dayOfWeek?: number): Promise<any>;
    getClinics(installationCode?: string, type?: string, bpjsOnly?: boolean): Promise<any>;
    getServices(categoryCode?: string, installationCode?: string, search?: string, isBpjs?: boolean): Promise<any>;
    getPaymentSchemes(type?: string): Promise<any>;
    getServiceTariffs(serviceId: string, schemeCode?: string): Promise<any>;
    getRegions(level?: string, parentCode?: string): Promise<any>;
    getSystemConfigs(group?: string): Promise<any>;
    updateSystemConfig(key: string, value: string, userId: string): Promise<{
        message: string;
    }>;
}
export declare class MasterController {
    private readonly svc;
    constructor(svc: MasterService);
    doctors(s?: string, sp?: string, c?: string): Promise<any>;
    schedules(d?: string, c?: string, day?: number): Promise<any>;
    clinics(inst?: string, t?: string, bpjs?: string): Promise<any>;
    services(cat?: string, inst?: string, s?: string, bpjs?: string): Promise<any>;
    tariffs(id: string, scheme?: string): Promise<any>;
    schemes(t?: string): Promise<any>;
    regions(l?: string, p?: string): Promise<any>;
    configs(g?: string): Promise<any>;
    updateConfig(k: string, v: string, uid: string): Promise<{
        message: string;
    }>;
}
export declare class ReportsService {
    private ds;
    constructor(ds: DataSource);
    visitStats(startDate: string, endDate: string, groupBy?: 'day' | 'week' | 'month'): Promise<any>;
    revenueReport(startDate: string, endDate: string): Promise<any>;
    bpjsReport(month: number, year: number): Promise<any>;
    bedOccupancy(startDate: string, endDate: string): Promise<any>;
    drugUsage(startDate: string, endDate: string, warehouseId?: string): Promise<any>;
    dashboardSummary(): Promise<{
        today: any;
        beds: any;
        todayRevenue: number;
        pendingRx: number;
    }>;
}
export declare class ReportsController {
    private readonly svc;
    constructor(svc: ReportsService);
    dashboard(): Promise<{
        today: any;
        beds: any;
        todayRevenue: number;
        pendingRx: number;
    }>;
    visits(s: string, e: string, g?: any): Promise<any>;
    revenue(s: string, e: string): Promise<any>;
    bpjs(m: number, y: number): Promise<any>;
    beds(s: string, e: string): Promise<any>;
    drugs(s: string, e: string, w?: string): Promise<any>;
}
export declare class CoreModules {
}
