"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationModule = exports.RegistrationController = exports.RegistrationService = exports.VitalSignsDto = exports.UpdateVisitStatusDto = exports.CreateAppointmentDto = exports.CreateVisitDto = exports.Appointment = exports.Visit = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const typeorm_4 = require("@nestjs/typeorm");
const auth_guard_1 = require("../../common/guards/auth.guard");
const decorators_1 = require("../../common/decorators");
let Visit = class Visit {
    id;
    visitNumber;
    patientId;
    visitDate;
    visitType;
    clinicId;
    doctorId;
    paymentSchemeId;
    referralType;
    referralNumber;
    referralFrom;
    chiefComplaint;
    visitStatus;
    queueNumber;
    registeredBy;
    notes;
    createdAt;
    updatedAt;
};
exports.Visit = Visit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Visit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_number', length: 30 }),
    __metadata("design:type", String)
], Visit.prototype, "visitNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", String)
], Visit.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_date', type: 'date' }),
    __metadata("design:type", Date)
], Visit.prototype, "visitDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_type', length: 20 }),
    __metadata("design:type", String)
], Visit.prototype, "visitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinic_id' }),
    __metadata("design:type", String)
], Visit.prototype, "clinicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_id', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "doctorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_scheme_id' }),
    __metadata("design:type", String)
], Visit.prototype, "paymentSchemeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_type', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "referralType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_number', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "referralNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_from', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "referralFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chief_complaint', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "chiefComplaint", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_status', default: 'registered' }),
    __metadata("design:type", String)
], Visit.prototype, "visitStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'queue_number', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "queueNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'registered_by', nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "registeredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Visit.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Visit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Visit.prototype, "updatedAt", void 0);
exports.Visit = Visit = __decorate([
    (0, typeorm_1.Entity)('visits')
], Visit);
let Appointment = class Appointment {
    id;
    appointmentNo;
    patientId;
    doctorId;
    clinicId;
    appointmentDate;
    timeSlot;
    paymentSchemeId;
    status;
    bookingChannel;
    visitId;
    createdAt;
    updatedAt;
};
exports.Appointment = Appointment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_no', length: 20 }),
    __metadata("design:type", String)
], Appointment.prototype, "appointmentNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'patient_id' }),
    __metadata("design:type", String)
], Appointment.prototype, "patientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'doctor_id' }),
    __metadata("design:type", String)
], Appointment.prototype, "doctorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clinic_id' }),
    __metadata("design:type", String)
], Appointment.prototype, "clinicId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'appointment_date', type: 'date' }),
    __metadata("design:type", Date)
], Appointment.prototype, "appointmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_slot', type: 'time' }),
    __metadata("design:type", String)
], Appointment.prototype, "timeSlot", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_scheme_id', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "paymentSchemeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'booked' }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'booking_channel', default: 'counter' }),
    __metadata("design:type", String)
], Appointment.prototype, "bookingChannel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'visit_id', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "visitId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Appointment.prototype, "updatedAt", void 0);
exports.Appointment = Appointment = __decorate([
    (0, typeorm_1.Entity)('appointments')
], Appointment);
class CreateVisitDto {
    patientId;
    clinicId;
    doctorId;
    paymentSchemeId;
    visitType;
    referralType;
    referralNumber;
    referralFrom;
    chiefComplaint;
    notes;
}
exports.CreateVisitDto = CreateVisitDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "paymentSchemeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['outpatient', 'inpatient', 'igd', 'surgery'] }),
    (0, class_validator_1.IsEnum)(['outpatient', 'inpatient', 'igd', 'surgery']),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "visitType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "referralType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "referralNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "referralFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVisitDto.prototype, "notes", void 0);
class CreateAppointmentDto {
    patientId;
    doctorId;
    clinicId;
    appointmentDate;
    timeSlot;
    paymentSchemeId;
    bookingChannel;
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "patientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "doctorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "clinicId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "appointmentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "timeSlot", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "paymentSchemeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['counter', 'online', 'phone'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['counter', 'online', 'phone']),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "bookingChannel", void 0);
class UpdateVisitStatusDto {
    status;
    notes;
}
exports.UpdateVisitStatusDto = UpdateVisitStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['registered', 'waiting', 'in_progress', 'done', 'cancelled'] }),
    (0, class_validator_1.IsEnum)(['registered', 'waiting', 'in_progress', 'done', 'cancelled']),
    __metadata("design:type", String)
], UpdateVisitStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVisitStatusDto.prototype, "notes", void 0);
class VitalSignsDto {
    weightKg;
    heightCm;
    systolicBp;
    diastolicBp;
    pulseRate;
    respiratoryRate;
    temperatureC;
    spo2Pct;
    painScale;
    consciousness;
    notes;
}
exports.VitalSignsDto = VitalSignsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "weightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "heightCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "systolicBp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "diastolicBp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "pulseRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "respiratoryRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "temperatureC", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "spo2Pct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], VitalSignsDto.prototype, "painScale", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VitalSignsDto.prototype, "consciousness", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], VitalSignsDto.prototype, "notes", void 0);
let RegistrationService = class RegistrationService {
    visitRepo;
    apptRepo;
    ds;
    constructor(visitRepo, apptRepo, ds) {
        this.visitRepo = visitRepo;
        this.apptRepo = apptRepo;
        this.ds = ds;
    }
    async generateVisitNo() {
        const d = new Date();
        const prefix = `KJG-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
        const row = await this.ds.query(`SELECT COUNT(*)+1 AS seq FROM visits WHERE visit_number LIKE $1`, [`${prefix}%`]);
        return prefix + String(row[0].seq).padStart(3, '0');
    }
    async nextQueueNo(clinicId, prefix) {
        const today = new Date().toISOString().split('T')[0];
        await this.ds.query(`INSERT INTO queue_counters (clinic_id, queue_date, last_number)
       VALUES ($1, $2, 0) ON CONFLICT (clinic_id, queue_date) DO NOTHING`, [clinicId, today]);
        const row = await this.ds.query(`UPDATE queue_counters SET last_number = last_number + 1
       WHERE clinic_id = $1 AND queue_date = $2 RETURNING last_number`, [clinicId, today]);
        return `${prefix}-${String(row[0].last_number).padStart(3, '0')}`;
    }
    async register(dto, userId) {
        const [patient] = await this.ds.query(`SELECT id, medical_record_no, full_name FROM patients WHERE id = $1 AND is_active = true`, [dto.patientId]);
        if (!patient)
            throw new common_1.NotFoundException('Pasien tidak ditemukan atau tidak aktif');
        const [clinic] = await this.ds.query(`SELECT code, queue_prefix, name FROM clinics WHERE id = $1`, [dto.clinicId]);
        if (!clinic)
            throw new common_1.NotFoundException('Poli tidak ditemukan');
        const visitNo = await this.generateVisitNo();
        const queueNo = await this.nextQueueNo(dto.clinicId, clinic.queue_prefix || clinic.code);
        const v = this.visitRepo.create({
            visitNumber: visitNo, patientId: dto.patientId,
            visitDate: new Date(), visitType: dto.visitType,
            clinicId: dto.clinicId, doctorId: dto.doctorId,
            paymentSchemeId: dto.paymentSchemeId,
            referralType: dto.referralType, referralNumber: dto.referralNumber,
            referralFrom: dto.referralFrom, chiefComplaint: dto.chiefComplaint,
            visitStatus: 'registered', queueNumber: queueNo,
            registeredBy: userId, notes: dto.notes,
        });
        const saved = await this.visitRepo.save(v);
        return {
            ...saved,
            patient: { mrNo: patient.medical_record_no, name: patient.full_name },
            clinic: clinic.name,
            message: `Pendaftaran berhasil. Nomor antrian: ${queueNo}`,
        };
    }
    async getTodayQueue(clinicId, status) {
        const today = new Date().toISOString().split('T')[0];
        let where = `v.visit_date = '${today}'`;
        const params = [];
        if (clinicId) {
            params.push(clinicId);
            where += ` AND v.clinic_id = $${params.length}`;
        }
        if (status) {
            params.push(status);
            where += ` AND v.visit_status = $${params.length}`;
        }
        return this.ds.query(`SELECT v.id, v.visit_number, v.queue_number, v.visit_status, v.visit_type,
              v.checkin_at, v.chief_complaint,
              p.medical_record_no, p.full_name AS patient_name,
              EXTRACT(YEAR FROM AGE(p.date_of_birth))::int AS age,
              p.bpjs_number, c.name AS clinic_name, c.code AS clinic_code,
              CONCAT(doc.title_prefix,' ',e.full_name,', ',doc.title_suffix) AS doctor_name,
              ps.name AS scheme_name, ps.scheme_type
       FROM visits v
       JOIN patients p       ON p.id = v.patient_id
       JOIN clinics c        ON c.id = v.clinic_id
       LEFT JOIN doctors doc ON doc.id = v.doctor_id
       LEFT JOIN employees e ON e.id = doc.employee_id
       JOIN payment_schemes ps ON ps.id = v.payment_scheme_id
       WHERE ${where}
       ORDER BY c.code, v.queue_number`, params);
    }
    async getVisit(id) {
        const rows = await this.ds.query(`SELECT v.*, p.medical_record_no, p.full_name AS patient_name,
              p.date_of_birth, p.gender, p.bpjs_number, p.allergy_notes,
              c.name AS clinic_name, c.code AS clinic_code,
              e.full_name AS doctor_name, doc.title_prefix, doc.title_suffix,
              ps.name AS scheme_name, ps.scheme_type,
              vv.weight_kg, vv.height_cm, vv.bmi, vv.systolic_bp,
              vv.diastolic_bp, vv.pulse_rate, vv.temperature_c, vv.spo2_pct, vv.pain_scale
       FROM visits v
       JOIN patients p ON p.id = v.patient_id
       JOIN clinics c ON c.id = v.clinic_id
       LEFT JOIN doctors doc ON doc.id = v.doctor_id
       LEFT JOIN employees e ON e.id = doc.employee_id
       JOIN payment_schemes ps ON ps.id = v.payment_scheme_id
       LEFT JOIN visit_vitals vv ON vv.visit_id = v.id
       WHERE v.id = $1 LIMIT 1`, [id]);
        if (!rows[0])
            throw new common_1.NotFoundException('Kunjungan tidak ditemukan');
        return rows[0];
    }
    async updateStatus(id, dto) {
        const v = await this.visitRepo.findOneBy({ id });
        if (!v)
            throw new common_1.NotFoundException('Kunjungan tidak ditemukan');
        const updates = { visitStatus: dto.status };
        if (dto.status === 'in_progress')
            updates.checkinAt = new Date();
        if (dto.status === 'done')
            updates.checkoutAt = new Date();
        await this.visitRepo.update(id, updates);
        return { message: `Status kunjungan diupdate ke: ${dto.status}` };
    }
    async addVitals(visitId, dto, userId) {
        await this.ds.query(`INSERT INTO visit_vitals
         (visit_id, measured_by, weight_kg, height_cm, systolic_bp, diastolic_bp,
          pulse_rate, respiratory_rate, temperature_c, spo2_pct, pain_scale, consciousness, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [visitId, userId, dto.weightKg, dto.heightCm, dto.systolicBp,
            dto.diastolicBp, dto.pulseRate, dto.respiratoryRate, dto.temperatureC,
            dto.spo2Pct, dto.painScale, dto.consciousness, dto.notes]);
        return { message: 'Vital signs berhasil disimpan' };
    }
    async callQueue(visitId) {
        await this.ds.query(`UPDATE visits SET queue_called_at = NOW(), visit_status = 'waiting'
       WHERE id = $1 AND visit_status = 'registered'`, [visitId]);
        return { message: 'Pasien dipanggil' };
    }
    async createAppointment(dto, userId) {
        const conflict = await this.ds.query(`SELECT id FROM appointments
       WHERE doctor_id=$1 AND appointment_date=$2 AND time_slot=$3
         AND status NOT IN ('cancelled','no_show')`, [dto.doctorId, dto.appointmentDate, dto.timeSlot]);
        if (conflict.length)
            throw new common_1.BadRequestException('Slot waktu sudah terisi');
        const d = new Date();
        const prefix = `APT-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM appointments WHERE appointment_no LIKE '${prefix}%'`);
        const no = `${prefix}-${String(cnt.n).padStart(4, '0')}`;
        const a = this.apptRepo.create({
            appointmentNo: no, patientId: dto.patientId, doctorId: dto.doctorId,
            clinicId: dto.clinicId, appointmentDate: dto.appointmentDate,
            timeSlot: dto.timeSlot, paymentSchemeId: dto.paymentSchemeId,
            status: 'booked', bookingChannel: dto.bookingChannel || 'counter',
        });
        return this.apptRepo.save(a);
    }
    async getAppointments(date, doctorId, clinicId, status) {
        let where = 'WHERE 1=1';
        const p = [];
        if (date) {
            p.push(date);
            where += ` AND a.appointment_date = $${p.length}`;
        }
        if (doctorId) {
            p.push(doctorId);
            where += ` AND a.doctor_id = $${p.length}`;
        }
        if (clinicId) {
            p.push(clinicId);
            where += ` AND a.clinic_id = $${p.length}`;
        }
        if (status) {
            p.push(status);
            where += ` AND a.status = $${p.length}`;
        }
        return this.ds.query(`SELECT a.*, p.medical_record_no, p.full_name AS patient_name, p.phone,
              CONCAT(doc.title_prefix,' ',e.full_name,', ',doc.title_suffix) AS doctor_name,
              c.name AS clinic_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors doc ON doc.id = a.doctor_id
       JOIN employees e ON e.id = doc.employee_id
       JOIN clinics c ON c.id = a.clinic_id
       ${where} ORDER BY a.appointment_date, a.time_slot`, p);
    }
    async checkInAppointment(apptId, userId) {
        const [appt] = await this.ds.query(`SELECT * FROM appointments WHERE id=$1`, [apptId]);
        if (!appt)
            throw new common_1.NotFoundException('Booking tidak ditemukan');
        if (appt.status !== 'booked' && appt.status !== 'confirmed')
            throw new common_1.BadRequestException('Booking tidak bisa di-check-in');
        const visitDto = {
            patientId: appt.patient_id, clinicId: appt.clinic_id,
            doctorId: appt.doctor_id, paymentSchemeId: appt.payment_scheme_id,
            visitType: 'outpatient',
        };
        const visit = await this.register(visitDto, userId);
        await this.apptRepo.update(apptId, { status: 'checked_in', visitId: visit.id });
        return { visit, message: 'Check-in berhasil' };
    }
};
exports.RegistrationService = RegistrationService;
exports.RegistrationService = RegistrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(Visit)),
    __param(1, (0, typeorm_2.InjectRepository)(Appointment)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.Repository,
        typeorm_3.DataSource])
], RegistrationService);
let RegistrationController = class RegistrationController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    register(dto, uid) {
        return this.svc.register(dto, uid);
    }
    todayQueue(clinicId, status) { return this.svc.getTodayQueue(clinicId, status); }
    getVisit(id) { return this.svc.getVisit(id); }
    updateStatus(id, dto) {
        return this.svc.updateStatus(id, dto);
    }
    addVitals(id, dto, uid) {
        return this.svc.addVitals(id, dto, uid);
    }
    callQueue(id) { return this.svc.callQueue(id); }
    createAppt(dto, uid) {
        return this.svc.createAppointment(dto, uid);
    }
    getAppts(date, doctorId, clinicId, status) { return this.svc.getAppointments(date, doctorId, clinicId, status); }
    checkIn(id, uid) {
        return this.svc.checkInAppointment(id, uid);
    }
};
exports.RegistrationController = RegistrationController;
__decorate([
    (0, common_2.Post)('visits'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar kunjungan baru' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateVisitDto, String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "register", null);
__decorate([
    (0, common_2.Get)('visits/today'),
    (0, swagger_2.ApiOperation)({ summary: 'Antrian hari ini' }),
    __param(0, (0, common_2.Query)('clinicId')),
    __param(1, (0, common_2.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "todayQueue", null);
__decorate([
    (0, common_2.Get)('visits/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Detail kunjungan' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "getVisit", null);
__decorate([
    (0, common_2.Patch)('visits/:id/status'),
    (0, swagger_2.ApiOperation)({ summary: 'Update status kunjungan' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateVisitStatusDto]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "updateStatus", null);
__decorate([
    (0, common_2.Post)('visits/:id/vitals'),
    (0, swagger_2.ApiOperation)({ summary: 'Input vital signs' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, VitalSignsDto, String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "addVitals", null);
__decorate([
    (0, common_2.Post)('visits/:id/call'),
    (0, swagger_2.ApiOperation)({ summary: 'Panggil antrian' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "callQueue", null);
__decorate([
    (0, common_2.Post)('appointments'),
    (0, swagger_2.ApiOperation)({ summary: 'Buat booking online/counter' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAppointmentDto, String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "createAppt", null);
__decorate([
    (0, common_2.Get)('appointments'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar booking' }),
    __param(0, (0, common_2.Query)('date')),
    __param(1, (0, common_2.Query)('doctorId')),
    __param(2, (0, common_2.Query)('clinicId')),
    __param(3, (0, common_2.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "getAppts", null);
__decorate([
    (0, common_2.Post)('appointments/:id/checkin'),
    (0, swagger_2.ApiOperation)({ summary: 'Check-in booking → buat kunjungan otomatis' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RegistrationController.prototype, "checkIn", null);
exports.RegistrationController = RegistrationController = __decorate([
    (0, swagger_2.ApiTags)('Registration'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('registration'),
    __metadata("design:paramtypes", [RegistrationService])
], RegistrationController);
let RegistrationModule = class RegistrationModule {
};
exports.RegistrationModule = RegistrationModule;
exports.RegistrationModule = RegistrationModule = __decorate([
    (0, common_3.Module)({
        imports: [typeorm_4.TypeOrmModule.forFeature([Visit, Appointment])],
        controllers: [RegistrationController],
        providers: [RegistrationService],
        exports: [RegistrationService],
    })
], RegistrationModule);
//# sourceMappingURL=registration.module.js.map