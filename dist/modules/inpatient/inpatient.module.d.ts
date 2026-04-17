import { DataSource } from 'typeorm';
export declare class CreateAdmissionDto {
    visitId: string;
    bedId: string;
    dpjpDoctorId?: string;
    admissionType?: string;
    admissionDiagnosis?: string;
    expectedLosDays?: number;
}
export declare class TransferBedDto {
    toBedId: string;
    reason?: string;
}
export declare class DischargeDto {
    dischargeType?: string;
    dischargeSummary?: string;
    dischargeDiagnosis?: string;
}
export declare class CpptEntryDto {
    entryType?: string;
    soapS?: string;
    soapO?: string;
    soapA?: string;
    soapP?: string;
}
export declare class TriageDto {
    triageLevel: number;
    arrivalMode?: string;
    chiefComplaint: string;
    mechanism?: string;
    isTrauma?: boolean;
    gcsEye?: number;
    gcsVerbal?: number;
    gcsMotor?: number;
    notes?: string;
}
export declare class CreateSurgeryDto {
    visitId: string;
    operatingRoomId: string;
    serviceId: string;
    surgeonId: string;
    anesthesiologistId?: string;
    anesthesiaType?: string;
    scheduledStart: string;
    scheduledEnd: string;
    preOpDiagnosis?: string;
    assistantIds?: string[];
}
export declare class UpdateSurgeryDto {
    actualStart?: string;
    actualEnd?: string;
    status?: string;
    postOpDiagnosis?: string;
    procedurePerformed?: string;
    findings?: string;
    bloodLossMl?: number;
}
export declare class InpatientService {
    private ds;
    constructor(ds: DataSource);
    getBedStatus(roomClass?: string, status?: string, buildingFloor?: string): Promise<any>;
    getBedSummary(): Promise<any>;
    admit(dto: CreateAdmissionDto, userId: string): Promise<any>;
    getActiveAdmissions(page?: number, limit?: number): Promise<any>;
    getAdmission(id: string): Promise<any>;
    transferBed(admId: string, dto: TransferBedDto, userId: string): Promise<{
        message: string;
    }>;
    discharge(admId: string, dto: DischargeDto): Promise<{
        message: string;
    }>;
    addCppt(admId: string, dto: CpptEntryDto, userId: string): Promise<any>;
    getCppt(admId: string): Promise<any>;
    verifyCppt(entryId: string, userId: string): Promise<{
        message: string;
    }>;
    createTriage(visitId: string, dto: TriageDto, userId: string): Promise<any>;
    getIgdQueue(): Promise<any>;
    scheduleSurgery(dto: CreateSurgeryDto, userId: string): Promise<any>;
    getSurgeries(date?: string, status?: string, roomId?: string): Promise<any>;
    updateSurgery(id: string, dto: UpdateSurgeryDto): Promise<{
        message: string;
    }>;
}
export declare class InpatientController {
    private readonly svc;
    constructor(svc: InpatientService);
    getBeds(rc?: string, st?: string): Promise<any>;
    getBedSummary(): Promise<any>;
    admit(dto: CreateAdmissionDto, uid: string): Promise<any>;
    getActive(p?: number, l?: number): Promise<any>;
    getOne(id: string): Promise<any>;
    transfer(id: string, dto: TransferBedDto, uid: string): Promise<{
        message: string;
    }>;
    discharge(id: string, dto: DischargeDto): Promise<{
        message: string;
    }>;
    addCppt(id: string, dto: CpptEntryDto, uid: string): Promise<any>;
    getCppt(id: string): Promise<any>;
    verifyCppt(id: string, uid: string): Promise<{
        message: string;
    }>;
    triage(id: string, dto: TriageDto, uid: string): Promise<any>;
    igdQueue(): Promise<any>;
    schedule(dto: CreateSurgeryDto, uid: string): Promise<any>;
    getSurgeries(d?: string, s?: string, r?: string): Promise<any>;
    updateSurgery(id: string, dto: UpdateSurgeryDto): Promise<{
        message: string;
    }>;
}
export declare class InpatientModule {
}
