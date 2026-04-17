import { Repository, DataSource } from 'typeorm';
export declare class Patient {
    id: string;
    medicalRecordNo: string;
    nik: string;
    bpjsNumber: string;
    fullName: string;
    dateOfBirth: Date;
    gender: string;
    bloodType: string;
    religion: string;
    maritalStatus: string;
    occupation: string;
    phone: string;
    email: string;
    addressId: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRel: string;
    allergyNotes: string;
    notes: string;
    isActive: boolean;
    dataCompleteness: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreatePatientDto {
    nik?: string;
    bpjsNumber?: string;
    fullName: string;
    dateOfBirth?: string;
    gender?: string;
    bloodType?: string;
    religion?: string;
    maritalStatus?: string;
    occupation?: string;
    phone?: string;
    email?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRel?: string;
    allergyNotes?: string;
    notes?: string;
    street?: string;
    rtRw?: string;
    postalCode?: string;
    villageId?: string;
}
export declare class UpdatePatientDto extends CreatePatientDto {
}
export declare class PatientQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    bpjsNumber?: string;
    nik?: string;
    isActive?: boolean;
}
export declare class PatientsService {
    private repo;
    private ds;
    constructor(repo: Repository<Patient>, ds: DataSource);
    generateMRNo(): Promise<string>;
    create(dto: CreatePatientDto): Promise<any>;
    findAll(q: PatientQueryDto): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<any>;
    findByMR(mrNo: string): Promise<any>;
    update(id: string, dto: UpdatePatientDto): Promise<Patient>;
    getVisitHistory(patientId: string, limit?: number): Promise<any>;
    getAllergies(patientId: string): Promise<any>;
    addAllergy(patientId: string, body: any, userId: string): Promise<{
        message: string;
    }>;
}
export declare class PatientsController {
    private readonly svc;
    constructor(svc: PatientsService);
    create(dto: CreatePatientDto): Promise<any>;
    findAll(q: PatientQueryDto): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByMR(mrNo: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdatePatientDto): Promise<Patient>;
    getVisits(id: string, limit?: number): Promise<any>;
    getAllergies(id: string): Promise<any>;
    addAllergy(id: string, body: any, userId: string): Promise<{
        message: string;
    }>;
}
export declare class PatientsModule {
}
