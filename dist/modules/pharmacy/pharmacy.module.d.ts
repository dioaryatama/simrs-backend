import { DataSource } from 'typeorm';
export declare class DispenseDto {
    prescriptionId: string;
    warehouseId: string;
    notes?: string;
}
export declare class StockAdjustmentDto {
    warehouseId: string;
    drugId: string;
    batchNo: string;
    expiredDate?: string;
    quantity: number;
    mutationType?: string;
    unitPrice: number;
    notes?: string;
}
export declare class CreatePoDto {
    warehouseId: string;
    supplierName: string;
    supplierCode?: string;
    expectedDate?: string;
    notes?: string;
    items: PoItemDto[];
}
export declare class PoItemDto {
    drugId: string;
    quantityOrder: number;
    unit: string;
    unitPrice?: number;
}
export declare class ReceivePoDto {
    items: ReceivePoItemDto[];
}
export declare class ReceivePoItemDto {
    poItemId: string;
    quantityReceived: number;
    batchNo?: string;
    expiredDate?: string;
    unitPrice?: number;
}
export declare class DrugSearchDto {
    search?: string;
    warehouseId?: string;
    drugClassCode?: string;
    isFormularium?: boolean;
    page?: number;
    limit?: number;
}
export declare class PharmacyService {
    private ds;
    constructor(ds: DataSource);
    getPendingRx(warehouseId?: string): Promise<any>;
    getRxDetail(rxId: string): Promise<any>;
    dispense(dto: DispenseDto, userId: string): Promise<{
        dispensingNo: string;
        message: string;
    }>;
    getStock(warehouseId?: string, search?: string, lowStock?: boolean): Promise<any>;
    adjustStock(dto: StockAdjustmentDto, userId: string): Promise<{
        message: string;
        before: any;
        after: any;
    }>;
    getStockMutations(warehouseId: string, drugId?: string, startDate?: string, endDate?: string): Promise<any>;
    createPO(dto: CreatePoDto, userId: string): Promise<{
        poId: any;
        poNumber: string;
        message: string;
    }>;
    getPOs(status?: string, warehouseId?: string): Promise<any>;
    approvePO(poId: string, userId: string): Promise<{
        message: string;
    }>;
    receivePO(poId: string, dto: ReceivePoDto, userId: string): Promise<{
        message: string;
    }>;
    searchDrugs(q: DrugSearchDto): Promise<any>;
    getLowStockAlert(warehouseId?: string): Promise<any>;
    getExpiringDrugs(daysAhead?: number, warehouseId?: string): Promise<any>;
}
export declare class PharmacyController {
    private readonly svc;
    constructor(svc: PharmacyService);
    pending(): Promise<any>;
    rxDetail(id: string): Promise<any>;
    dispense(dto: DispenseDto, uid: string): Promise<{
        dispensingNo: string;
        message: string;
    }>;
    stock(wh?: string, s?: string, ls?: string): Promise<any>;
    adjust(dto: StockAdjustmentDto, uid: string): Promise<{
        message: string;
        before: any;
        after: any;
    }>;
    mutations(wh: string, d?: string, s?: string, e?: string): Promise<any>;
    lowStock(wh?: string): Promise<any>;
    expiring(d?: number, wh?: string): Promise<any>;
    createPO(dto: CreatePoDto, uid: string): Promise<{
        poId: any;
        poNumber: string;
        message: string;
    }>;
    getPOs(s?: string, wh?: string): Promise<any>;
    approvePO(id: string, uid: string): Promise<{
        message: string;
    }>;
    receivePO(id: string, dto: ReceivePoDto, uid: string): Promise<{
        message: string;
    }>;
    drugs(q: DrugSearchDto): Promise<any>;
}
export declare class PharmacyModule {
}
