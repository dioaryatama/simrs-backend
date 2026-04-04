import { Repository, DataSource } from 'typeorm';
export declare class Visit {
    id: string;
    visitNumber: string;
    patientId: string;
    visitDate: Date;
    visitType: string;
    clinicId: string;
    doctorId: string;
    paymentSchemeId: string;
    referralType: string;
    referralNumber: string;
    referralFrom: string;
    chiefComplaint: string;
    visitStatus: string;
    queueNumber: string;
    registeredBy: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Appointment {
    id: string;
    appointmentNo: string;
    patientId: string;
    doctorId: string;
    clinicId: string;
    appointmentDate: Date;
    timeSlot: string;
    paymentSchemeId: string;
    status: string;
    bookingChannel: string;
    visitId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateVisitDto {
    patientId: string;
    clinicId: string;
    doctorId?: string;
    paymentSchemeId: string;
    visitType: string;
    referralType?: string;
    referralNumber?: string;
    referralFrom?: string;
    chiefComplaint?: string;
    notes?: string;
}
export declare class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    clinicId: string;
    appointmentDate: string;
    timeSlot: string;
    paymentSchemeId?: string;
    bookingChannel?: string;
}
export declare class UpdateVisitStatusDto {
    status: string;
    notes?: string;
}
export declare class VitalSignsDto {
    weightKg?: number;
    heightCm?: number;
    systolicBp?: number;
    diastolicBp?: number;
    pulseRate?: number;
    respiratoryRate?: number;
    temperatureC?: number;
    spo2Pct?: number;
    painScale?: number;
    consciousness?: string;
    notes?: string;
}
export declare class RegistrationService {
    private visitRepo;
    private apptRepo;
    private ds;
    constructor(visitRepo: Repository<Visit>, apptRepo: Repository<Appointment>, ds: DataSource);
    private generateVisitNo;
    private nextQueueNo;
    register(dto: CreateVisitDto, userId: string): Promise<{
        patient: {
            mrNo: any;
            name: any;
        };
        clinic: any;
        message: string;
        id: string;
        visitNumber: string;
        patientId: string;
        visitDate: Date;
        visitType: string;
        clinicId: string;
        doctorId: string;
        paymentSchemeId: string;
        referralType: string;
        referralNumber: string;
        referralFrom: string;
        chiefComplaint: string;
        visitStatus: string;
        queueNumber: string;
        registeredBy: string;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTodayQueue(clinicId?: string, status?: string): Promise<any>;
    getVisit(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateVisitStatusDto): Promise<{
        message: string;
    }>;
    addVitals(visitId: string, dto: VitalSignsDto, userId: string): Promise<{
        message: string;
    }>;
    callQueue(visitId: string): Promise<{
        message: string;
    }>;
    createAppointment(dto: CreateAppointmentDto, userId: string): Promise<Appointment>;
    getAppointments(date?: string, doctorId?: string, clinicId?: string, status?: string): Promise<any>;
    checkInAppointment(apptId: string, userId: string): Promise<{
        visit: {
            patient: {
                mrNo: any;
                name: any;
            };
            clinic: any;
            message: string;
            id: string;
            visitNumber: string;
            patientId: string;
            visitDate: Date;
            visitType: string;
            clinicId: string;
            doctorId: string;
            paymentSchemeId: string;
            referralType: string;
            referralNumber: string;
            referralFrom: string;
            chiefComplaint: string;
            visitStatus: string;
            queueNumber: string;
            registeredBy: string;
            notes: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
}
export declare class RegistrationController {
    private readonly svc;
    constructor(svc: RegistrationService);
    register(dto: CreateVisitDto, uid: string): Promise<{
        patient: {
            mrNo: any;
            name: any;
        };
        clinic: any;
        message: string;
        id: string;
        visitNumber: string;
        patientId: string;
        visitDate: Date;
        visitType: string;
        clinicId: string;
        doctorId: string;
        paymentSchemeId: string;
        referralType: string;
        referralNumber: string;
        referralFrom: string;
        chiefComplaint: string;
        visitStatus: string;
        queueNumber: string;
        registeredBy: string;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    todayQueue(clinicId?: string, status?: string): Promise<any>;
    getVisit(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateVisitStatusDto): Promise<{
        message: string;
    }>;
    addVitals(id: string, dto: VitalSignsDto, uid: string): Promise<{
        message: string;
    }>;
    callQueue(id: string): Promise<{
        message: string;
    }>;
    createAppt(dto: CreateAppointmentDto, uid: string): Promise<Appointment>;
    getAppts(date?: string, doctorId?: string, clinicId?: string, status?: string): Promise<any>;
    checkIn(id: string, uid: string): Promise<{
        visit: {
            patient: {
                mrNo: any;
                name: any;
            };
            clinic: any;
            message: string;
            id: string;
            visitNumber: string;
            patientId: string;
            visitDate: Date;
            visitType: string;
            clinicId: string;
            doctorId: string;
            paymentSchemeId: string;
            referralType: string;
            referralNumber: string;
            referralFrom: string;
            chiefComplaint: string;
            visitStatus: string;
            queueNumber: string;
            registeredBy: string;
            notes: string;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
}
export declare class RegistrationModule {
}
