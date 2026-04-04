import { DataSource } from 'typeorm';
export declare class CreateSoapDto {
    visitId: string;
    noteType?: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    noteContent?: string;
}
export declare class AddDiagnosisDto {
    visitId: string;
    icd10Id: string;
    diagnosisType?: string;
    isConfirmed?: boolean;
    notes?: string;
}
export declare class CreateLabOrderDto {
    visitId: string;
    priority?: string;
    clinicalInfo?: string;
    serviceIds: string[];
}
export declare class LabResultDto {
    itemId: string;
    resultValue: string;
    resultUnit?: string;
    normalRange?: string;
    resultFlag?: string;
    notes?: string;
}
export declare class CreateRadOrderDto {
    visitId: string;
    serviceId: string;
    priority?: string;
    clinicalInfo?: string;
}
export declare class CreatePrescriptionDto {
    visitId: string;
    prescriptionType?: string;
    notes?: string;
    items: PrescriptionItemDto[];
}
export declare class PrescriptionItemDto {
    drugId: string;
    quantity: number;
    unit: string;
    dosageInstruction: string;
    durationDays?: number;
    route?: string;
    isGeneric?: boolean;
}
export declare class CreateProcedureDto {
    visitId: string;
    serviceId: string;
    icd9Id?: string;
    quantity?: number;
    notes?: string;
}
export declare class EmrService {
    private ds;
    constructor(ds: DataSource);
    createNote(dto: CreateSoapDto, userId: string): Promise<any>;
    getNotes(visitId: string): Promise<any>;
    lockNote(noteId: string): Promise<{
        message: string;
    }>;
    addDiagnosis(dto: AddDiagnosisDto, userId: string): Promise<any>;
    getDiagnoses(visitId: string): Promise<any>;
    removeDiagnosis(diagId: string): Promise<{
        message: string;
    }>;
    createLabOrder(dto: CreateLabOrderDto, userId: string): Promise<{
        orderId: any;
        orderNo: string;
        message: string;
    }>;
    getLabOrders(visitId: string): Promise<any>;
    inputLabResult(itemId: string, dto: LabResultDto, userId: string): Promise<{
        message: string;
    }>;
    createRadOrder(dto: CreateRadOrderDto, userId: string): Promise<any>;
    getRadOrders(visitId: string): Promise<any>;
    inputRadResult(orderId: string, body: {
        expertise: string;
        imageUrls?: string[];
    }, userId: string): Promise<{
        message: string;
    }>;
    createPrescription(dto: CreatePrescriptionDto, userId: string): Promise<{
        prescriptionId: any;
        prescriptionNo: string;
        message: string;
    }>;
    getPrescriptions(visitId: string): Promise<any>;
    addProcedure(dto: CreateProcedureDto, userId: string): Promise<any>;
    getProcedures(visitId: string): Promise<any>;
    searchIcd10(q: string, limit?: number): Promise<any>;
    searchIcd9(q: string, limit?: number): Promise<any>;
}
export declare class EmrController {
    private readonly svc;
    constructor(svc: EmrService);
    createNote(dto: CreateSoapDto, uid: string): Promise<any>;
    getNotes(id: string): Promise<any>;
    lockNote(id: string): Promise<{
        message: string;
    }>;
    addDiagnosis(dto: AddDiagnosisDto, uid: string): Promise<any>;
    getDiagnoses(id: string): Promise<any>;
    removeDiagnosis(id: string): Promise<{
        message: string;
    }>;
    createLab(dto: CreateLabOrderDto, uid: string): Promise<{
        orderId: any;
        orderNo: string;
        message: string;
    }>;
    getLab(id: string): Promise<any>;
    inputLabResult(id: string, dto: LabResultDto, uid: string): Promise<{
        message: string;
    }>;
    createRad(dto: CreateRadOrderDto, uid: string): Promise<any>;
    getRad(id: string): Promise<any>;
    inputRadResult(id: string, body: any, uid: string): Promise<{
        message: string;
    }>;
    createRx(dto: CreatePrescriptionDto, uid: string): Promise<{
        prescriptionId: any;
        prescriptionNo: string;
        message: string;
    }>;
    getRx(id: string): Promise<any>;
    addProc(dto: CreateProcedureDto, uid: string): Promise<any>;
    getProcs(id: string): Promise<any>;
    searchIcd10(q: string, limit?: number): Promise<any>;
    searchIcd9(q: string, limit?: number): Promise<any>;
}
export declare class EmrModule {
}
