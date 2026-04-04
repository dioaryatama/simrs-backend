import { DataSource } from 'typeorm';
export declare class CreateLeaveDto {
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason?: string;
}
export declare class RecordAttendanceDto {
    employeeId: string;
    checkIn?: string;
    checkOut?: string;
    shiftId?: string;
    status?: string;
    leaveType?: string;
    notes?: string;
}
export declare class RunPayrollDto {
    periodMonth: number;
    periodYear: number;
    employeeIds?: string[];
}
export declare class CreateAssetDto {
    assetCode: string;
    name: string;
    categoryId: string;
    departmentId?: string;
    location?: string;
    purchaseDate?: string;
    purchasePrice: number;
    usefulLifeMonths?: number;
    salvageValue?: number;
    brand?: string;
    model?: string;
    serialNumber?: string;
    assetAccountId?: string;
    deprAccountId?: string;
    accDeprAccountId?: string;
}
export declare class ScheduleMaintenanceDto {
    assetId: string;
    maintenanceType: string;
    scheduledDate?: string;
    vendor?: string;
    cost?: number;
    description?: string;
}
export declare class InventoryMutationDto {
    warehouseId: string;
    itemId: string;
    mutationType: string;
    quantity: number;
    unitPrice?: number;
    notes?: string;
}
export declare class HrService {
    private ds;
    constructor(ds: DataSource);
    getEmployees(search?: string, departmentId?: string, isActive?: boolean, page?: number, limit?: number): Promise<any>;
    getEmployee(id: string): Promise<any>;
    recordAttendance(dto: RecordAttendanceDto, userId: string): Promise<{
        message: string;
    }>;
    getAttendance(employeeId?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<any>;
    getAttendanceSummary(employeeId: string, month: number, year: number): Promise<any>;
    requestLeave(dto: CreateLeaveDto, userId: string): Promise<any>;
    processLeave(id: string, action: 'approved' | 'rejected', userId: string, reason?: string): Promise<{
        message: string;
    }>;
    getLeaveRequests(employeeId?: string, status?: string): Promise<any>;
    runPayroll(dto: RunPayrollDto, userId: string): Promise<{
        runId: any;
        runNo: string;
        totalEmployees: any;
        totalGross: number;
        totalNet: number;
        message: string;
    }>;
    getPayrollRuns(year?: number): Promise<any>;
    getPayrollSlips(runId: string, employeeId?: string): Promise<any>;
    approvePayroll(runId: string, userId: string): Promise<{
        message: string;
    }>;
}
export declare class InventoryService {
    private ds;
    constructor(ds: DataSource);
    getStock(warehouseId?: string, search?: string): Promise<any>;
    mutate(dto: InventoryMutationDto, userId: string): Promise<{
        message: string;
        before: any;
        after: any;
    }>;
    getAssets(status?: string, search?: string): Promise<any>;
    createAsset(dto: CreateAssetDto, userId: string): Promise<any>;
    calculateDepreciation(periodId: string, userId: string): Promise<{
        calculated: number;
        message: string;
    }>;
    scheduleMaintenance(dto: ScheduleMaintenanceDto, userId: string): Promise<any>;
    completeMaintenance(id: string, body: {
        doneDate: string;
        cost?: number;
        description?: string;
    }, userId: string): Promise<{
        message: string;
    }>;
    disposeAsset(assetId: string, reason: string): Promise<{
        message: string;
    }>;
}
export declare class HrController {
    private readonly svc;
    constructor(svc: HrService);
    list(s?: string, d?: string, p?: number, l?: number): Promise<any>;
    detail(id: string): Promise<any>;
    recordAttendance(dto: RecordAttendanceDto, uid: string): Promise<{
        message: string;
    }>;
    getAttendance(e?: string, s?: string, ed?: string, p?: number, l?: number): Promise<any>;
    summary(id: string, m: number, y: number): Promise<any>;
    requestLeave(dto: CreateLeaveDto, uid: string): Promise<any>;
    getLeaves(e?: string, s?: string): Promise<any>;
    approveLeave(id: string, uid: string): Promise<{
        message: string;
    }>;
    rejectLeave(id: string, r: string, uid: string): Promise<{
        message: string;
    }>;
    runPayroll(dto: RunPayrollDto, uid: string): Promise<{
        runId: any;
        runNo: string;
        totalEmployees: any;
        totalGross: number;
        totalNet: number;
        message: string;
    }>;
    payrollRuns(y?: number): Promise<any>;
    slips(id: string, e?: string): Promise<any>;
    approvePayroll(id: string, uid: string): Promise<{
        message: string;
    }>;
}
export declare class InventoryController {
    private readonly svc;
    constructor(svc: InventoryService);
    stock(w?: string, s?: string): Promise<any>;
    mutate(dto: InventoryMutationDto, uid: string): Promise<{
        message: string;
        before: any;
        after: any;
    }>;
    assets(s?: string, q?: string): Promise<any>;
    createAsset(dto: CreateAssetDto, uid: string): Promise<any>;
    calcDepr(periodId: string, uid: string): Promise<{
        calculated: number;
        message: string;
    }>;
    scheduleMaint(dto: ScheduleMaintenanceDto, uid: string): Promise<any>;
    completeMaint(id: string, body: any, uid: string): Promise<{
        message: string;
    }>;
    dispose(id: string, r: string): Promise<{
        message: string;
    }>;
}
export declare class HrInventoryModule {
}
