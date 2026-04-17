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
exports.InpatientModule = exports.InpatientController = exports.InpatientService = exports.UpdateSurgeryDto = exports.CreateSurgeryDto = exports.TriageDto = exports.CpptEntryDto = exports.DischargeDto = exports.TransferBedDto = exports.CreateAdmissionDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const auth_guard_1 = require("../../common/guards/auth.guard");
const decorators_1 = require("../../common/decorators");
class CreateAdmissionDto {
    visitId;
    bedId;
    dpjpDoctorId;
    admissionType;
    admissionDiagnosis;
    expectedLosDays;
}
exports.CreateAdmissionDto = CreateAdmissionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "bedId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "dpjpDoctorId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['elective', 'emergency', 'referral'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admissionType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdmissionDto.prototype, "admissionDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAdmissionDto.prototype, "expectedLosDays", void 0);
class TransferBedDto {
    toBedId;
    reason;
}
exports.TransferBedDto = TransferBedDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TransferBedDto.prototype, "toBedId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TransferBedDto.prototype, "reason", void 0);
class DischargeDto {
    dischargeType;
    dischargeSummary;
    dischargeDiagnosis;
}
exports.DischargeDto = DischargeDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['cured', 'improved', 'referred', 'ama', 'deceased'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DischargeDto.prototype, "dischargeType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DischargeDto.prototype, "dischargeSummary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DischargeDto.prototype, "dischargeDiagnosis", void 0);
class CpptEntryDto {
    entryType;
    soapS;
    soapO;
    soapA;
    soapP;
}
exports.CpptEntryDto = CpptEntryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['doctor', 'nurse', 'pharmacist', 'other'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CpptEntryDto.prototype, "entryType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CpptEntryDto.prototype, "soapS", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CpptEntryDto.prototype, "soapO", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CpptEntryDto.prototype, "soapA", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CpptEntryDto.prototype, "soapP", void 0);
class TriageDto {
    triageLevel;
    arrivalMode;
    chiefComplaint;
    mechanism;
    isTrauma;
    gcsEye;
    gcsVerbal;
    gcsMotor;
    notes;
}
exports.TriageDto = TriageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ minimum: 1, maximum: 5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TriageDto.prototype, "triageLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ambulance', 'walk_in', 'referral', 'police'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TriageDto.prototype, "arrivalMode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TriageDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TriageDto.prototype, "mechanism", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], TriageDto.prototype, "isTrauma", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TriageDto.prototype, "gcsEye", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TriageDto.prototype, "gcsVerbal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TriageDto.prototype, "gcsMotor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TriageDto.prototype, "notes", void 0);
class CreateSurgeryDto {
    visitId;
    operatingRoomId;
    serviceId;
    surgeonId;
    anesthesiologistId;
    anesthesiaType;
    scheduledStart;
    scheduledEnd;
    preOpDiagnosis;
    assistantIds;
}
exports.CreateSurgeryDto = CreateSurgeryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "operatingRoomId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "surgeonId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "anesthesiologistId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "anesthesiaType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "scheduledStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "scheduledEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSurgeryDto.prototype, "preOpDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSurgeryDto.prototype, "assistantIds", void 0);
class UpdateSurgeryDto {
    actualStart;
    actualEnd;
    status;
    postOpDiagnosis;
    procedurePerformed;
    findings;
    bloodLossMl;
}
exports.UpdateSurgeryDto = UpdateSurgeryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSurgeryDto.prototype, "actualStart", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSurgeryDto.prototype, "actualEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['scheduled', 'in_progress', 'done', 'postponed', 'cancelled'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSurgeryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSurgeryDto.prototype, "postOpDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSurgeryDto.prototype, "procedurePerformed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateSurgeryDto.prototype, "findings", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateSurgeryDto.prototype, "bloodLossMl", void 0);
let InpatientService = class InpatientService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    async getBedStatus(roomClass, status, buildingFloor) {
        let where = 'WHERE 1=1';
        const p = [];
        if (roomClass) {
            p.push(roomClass);
            where += ` AND r.room_class=$${p.length}`;
        }
        if (status) {
            p.push(status);
            where += ` AND bs.status=$${p.length}`;
        }
        return this.ds.query(`SELECT b.id, b.bed_number, b.bed_class, r.building, r.floor,
              r.room_number, r.room_name, r.room_class, bs.status,
              bs.admission_id,
              p.full_name AS patient_name, p.medical_record_no,
              a.admission_date, a.dpjp_doctor_id,
              e.full_name AS dpjp_name
       FROM beds b
       JOIN rooms r ON r.id = b.room_id
       LEFT JOIN bed_status bs ON bs.bed_id = b.id
       LEFT JOIN admissions a ON a.id = bs.admission_id
       LEFT JOIN patients p ON p.id = a.patient_id
       LEFT JOIN doctors doc ON doc.id = a.dpjp_doctor_id
       LEFT JOIN employees e ON e.id = doc.employee_id
       ${where}
       ORDER BY r.building, r.floor, b.bed_number`, p);
    }
    async getBedSummary() {
        return this.ds.query(`SELECT bed_class, status, COUNT(*) AS count
       FROM beds b LEFT JOIN bed_status bs ON bs.bed_id = b.id
       GROUP BY bed_class, status ORDER BY bed_class, status`);
    }
    async admit(dto, userId) {
        const [bed] = await this.ds.query(`SELECT * FROM bed_status WHERE bed_id=$1`, [dto.bedId]);
        if (bed?.status === 'occupied')
            throw new common_1.BadRequestException('Bed sudah terisi');
        const d = new Date();
        const prefix = `ADM-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM admissions WHERE admission_no LIKE '${prefix}%'`);
        const admNo = prefix + String(cnt.n).padStart(3, '0');
        const [visit] = await this.ds.query(`SELECT patient_id, doctor_id FROM visits WHERE id=$1`, [dto.visitId]);
        if (!visit)
            throw new common_1.NotFoundException('Kunjungan tidak ditemukan');
        const [adm] = await this.ds.query(`INSERT INTO admissions
         (admission_no, visit_id, patient_id, bed_id, admitting_doctor_id, dpjp_doctor_id,
          admission_type, admission_status, admission_diagnosis, expected_los_days)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9) RETURNING *`, [admNo, dto.visitId, visit.patient_id, dto.bedId,
            visit.doctor_id, dto.dpjpDoctorId || visit.doctor_id,
            dto.admissionType || 'elective', dto.admissionDiagnosis, dto.expectedLosDays]);
        await this.ds.query(`INSERT INTO bed_status (bed_id, status, admission_id)
       VALUES ($1,'occupied',$2)
       ON CONFLICT (bed_id) DO UPDATE SET status='occupied', admission_id=$2`, [dto.bedId, adm.id]);
        return { ...adm, message: 'Pasien berhasil dirawat inap' };
    }
    async getActiveAdmissions(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        return this.ds.query(`SELECT a.id, a.admission_no, a.admission_date, a.actual_los_days,
              a.admission_status, a.admission_diagnosis,
              p.medical_record_no, p.full_name AS patient_name,
              p.bpjs_number, p.gender,
              r.building, r.floor, b.bed_number, b.bed_class,
              e_dpjp.full_name AS dpjp_name,
              CONCAT(doc.title_prefix,' ',e_dpjp.full_name,', ',doc.title_suffix) AS dpjp_full,
              ps.name AS scheme_name
       FROM admissions a
       JOIN visits v ON v.id = a.visit_id
       JOIN patients p ON p.id = a.patient_id
       JOIN beds b ON b.id = a.bed_id
       JOIN rooms r ON r.id = b.room_id
       LEFT JOIN doctors doc ON doc.id = a.dpjp_doctor_id
       LEFT JOIN employees e_dpjp ON e_dpjp.id = doc.employee_id
       JOIN payment_schemes ps ON ps.id = v.payment_scheme_id
       WHERE a.admission_status='active'
       ORDER BY a.admission_date DESC LIMIT $1 OFFSET $2`, [limit, offset]);
    }
    async getAdmission(id) {
        const [row] = await this.ds.query(`SELECT a.*, p.full_name AS patient_name, p.medical_record_no,
              p.bpjs_number, p.date_of_birth, p.gender,
              b.bed_number, b.bed_class, r.room_name, r.building, r.floor,
              e_adm.full_name AS admitting_doctor_name,
              e_dpjp.full_name AS dpjp_name
       FROM admissions a
       JOIN patients p ON p.id = a.patient_id
       JOIN beds b ON b.id = a.bed_id
       JOIN rooms r ON r.id = b.room_id
       LEFT JOIN doctors d1 ON d1.id = a.admitting_doctor_id
       LEFT JOIN employees e_adm ON e_adm.id = d1.employee_id
       LEFT JOIN doctors d2 ON d2.id = a.dpjp_doctor_id
       LEFT JOIN employees e_dpjp ON e_dpjp.id = d2.employee_id
       WHERE a.id=$1`, [id]);
        if (!row)
            throw new common_1.NotFoundException('Data rawat inap tidak ditemukan');
        return row;
    }
    async transferBed(admId, dto, userId) {
        const [adm] = await this.ds.query(`SELECT * FROM admissions WHERE id=$1`, [admId]);
        if (!adm)
            throw new common_1.NotFoundException();
        const [newBed] = await this.ds.query(`SELECT * FROM bed_status WHERE bed_id=$1`, [dto.toBedId]);
        if (newBed?.status === 'occupied')
            throw new common_1.BadRequestException('Bed tujuan sudah terisi');
        await this.ds.query(`INSERT INTO bed_transfers (admission_id, from_bed_id, to_bed_id, transfer_reason, transferred_by)
       VALUES ($1,$2,$3,$4,$5)`, [admId, adm.bed_id, dto.toBedId, dto.reason, userId]);
        await this.ds.query(`UPDATE admissions SET bed_id=$1 WHERE id=$2`, [dto.toBedId, admId]);
        await this.ds.query(`UPDATE bed_status SET status='available', admission_id=NULL WHERE bed_id=$1`, [adm.bed_id]);
        await this.ds.query(`INSERT INTO bed_status (bed_id, status, admission_id) VALUES ($1,'occupied',$2)
       ON CONFLICT (bed_id) DO UPDATE SET status='occupied', admission_id=$2`, [dto.toBedId, admId]);
        return { message: 'Transfer bed berhasil' };
    }
    async discharge(admId, dto) {
        const [adm] = await this.ds.query(`SELECT * FROM admissions WHERE id=$1`, [admId]);
        if (!adm)
            throw new common_1.NotFoundException();
        await this.ds.query(`UPDATE admissions SET discharge_date=NOW(), admission_status='discharged',
         discharge_type=$1, discharge_summary=$2, discharge_diagnosis=$3
       WHERE id=$4`, [dto.dischargeType || 'cured', dto.dischargeSummary, dto.dischargeDiagnosis, admId]);
        await this.ds.query(`UPDATE bed_status SET status='cleaning', admission_id=NULL WHERE bed_id=$1`, [adm.bed_id]);
        await this.ds.query(`UPDATE visits SET visit_status='done', checkout_at=NOW() WHERE id=$1`, [adm.visit_id]);
        return { message: 'Pasien berhasil dipulangkan' };
    }
    async addCppt(admId, dto, userId) {
        const [row] = await this.ds.query(`INSERT INTO cppt_entries (admission_id, entry_type, soap_s, soap_o, soap_a, soap_p, written_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [admId, dto.entryType || 'doctor', dto.soapS, dto.soapO, dto.soapA, dto.soapP, userId]);
        return row;
    }
    async getCppt(admId) {
        return this.ds.query(`SELECT ce.*, u.full_name AS written_by_name
       FROM cppt_entries ce JOIN users u ON u.id = ce.written_by
       WHERE ce.admission_id=$1 ORDER BY ce.entry_datetime`, [admId]);
    }
    async verifyCppt(entryId, userId) {
        await this.ds.query(`UPDATE cppt_entries SET is_verified=true, verified_by=$1, verified_at=NOW() WHERE id=$2`, [userId, entryId]);
        return { message: 'CPPT diverifikasi' };
    }
    async createTriage(visitId, dto, userId) {
        const [row] = await this.ds.query(`INSERT INTO igd_triages
         (visit_id, triage_level, arrival_mode, triaged_by, chief_complaint,
          mechanism, is_trauma, gcs_eye, gcs_verbal, gcs_motor, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (visit_id) DO UPDATE SET
         triage_level=$2, chief_complaint=$5, notes=$11
       RETURNING *`, [visitId, dto.triageLevel, dto.arrivalMode, userId, dto.chiefComplaint,
            dto.mechanism, dto.isTrauma || false, dto.gcsEye, dto.gcsVerbal, dto.gcsMotor, dto.notes]);
        return row;
    }
    async getIgdQueue() {
        return this.ds.query(`SELECT v.id, v.visit_number, v.visit_status, v.queue_number,
              p.full_name AS patient_name, p.medical_record_no, p.gender,
              t.triage_level, t.arrival_mode, t.chief_complaint, t.gcs_total,
              t.arrival_at,
              CASE t.triage_level
                WHEN 1 THEN 'Merah (Immediate)'
                WHEN 2 THEN 'Kuning (Urgent)'
                WHEN 3 THEN 'Hijau (Less Urgent)'
                WHEN 4 THEN 'Putih (Non Urgent)'
                WHEN 5 THEN 'Hitam (Deceased)'
              END AS triage_label
       FROM visits v
       JOIN patients p ON p.id = v.patient_id
       LEFT JOIN igd_triages t ON t.visit_id = v.id
       WHERE v.visit_type='igd' AND v.visit_date=CURRENT_DATE
         AND v.visit_status NOT IN ('done','cancelled')
       ORDER BY t.triage_level NULLS LAST, t.arrival_at`);
    }
    async scheduleSurgery(dto, userId) {
        const d = new Date();
        const prefix = `OK-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM surgery_schedules WHERE schedule_no LIKE '${prefix}%'`);
        const no = prefix + String(cnt.n).padStart(4, '0');
        const [visit] = await this.ds.query(`SELECT patient_id FROM visits WHERE id=$1`, [dto.visitId]);
        const [row] = await this.ds.query(`INSERT INTO surgery_schedules
         (schedule_no, visit_id, patient_id, operating_room_id, surgeon_id,
          anesthesiologist_id, anesthesia_type, service_id,
          scheduled_start, scheduled_end, pre_op_diagnosis,
          assistant_ids, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'scheduled',$13) RETURNING *`, [no, dto.visitId, visit.patient_id, dto.operatingRoomId, dto.surgeonId,
            dto.anesthesiologistId, dto.anesthesiaType, dto.serviceId,
            dto.scheduledStart, dto.scheduledEnd, dto.preOpDiagnosis,
            JSON.stringify(dto.assistantIds || []), userId]);
        return { ...row, message: 'Jadwal operasi berhasil dibuat' };
    }
    async getSurgeries(date, status, roomId) {
        let where = 'WHERE 1=1';
        const p = [];
        if (date) {
            p.push(date);
            where += ` AND DATE(ss.scheduled_start)=$${p.length}`;
        }
        if (status) {
            p.push(status);
            where += ` AND ss.status=$${p.length}`;
        }
        if (roomId) {
            p.push(roomId);
            where += ` AND ss.operating_room_id=$${p.length}`;
        }
        return this.ds.query(`SELECT ss.id, ss.schedule_no, ss.scheduled_start, ss.scheduled_end,
              ss.actual_start, ss.actual_end, ss.status,
              ss.pre_op_diagnosis, ss.post_op_diagnosis, ss.procedure_performed,
              p.full_name AS patient_name, p.medical_record_no,
              s.name AS procedure_name,
              e_surg.full_name AS surgeon_name,
              e_ans.full_name AS anesthesiologist_name,
              c.name AS operating_room_name
       FROM surgery_schedules ss
       JOIN patients p ON p.id = ss.patient_id
       JOIN services s ON s.id = ss.service_id
       JOIN doctors d_surg ON d_surg.id = ss.surgeon_id
       JOIN employees e_surg ON e_surg.id = d_surg.employee_id
       LEFT JOIN doctors d_ans ON d_ans.id = ss.anesthesiologist_id
       LEFT JOIN employees e_ans ON e_ans.id = d_ans.employee_id
       JOIN clinics c ON c.id = ss.operating_room_id
       ${where} ORDER BY ss.scheduled_start`, p);
    }
    async updateSurgery(id, dto) {
        const fields = [];
        const vals = [];
        const add = (f, v) => { if (v !== undefined) {
            vals.push(v);
            fields.push(`${f}=$${vals.length}`);
        } };
        add('actual_start', dto.actualStart);
        add('actual_end', dto.actualEnd);
        add('status', dto.status);
        add('post_op_diagnosis', dto.postOpDiagnosis);
        add('procedure_performed', dto.procedurePerformed);
        add('findings', dto.findings);
        add('blood_loss_ml', dto.bloodLossMl);
        if (!fields.length)
            return { message: 'Tidak ada perubahan' };
        vals.push(id);
        await this.ds.query(`UPDATE surgery_schedules SET ${fields.join(',')} WHERE id=$${vals.length}`, vals);
        return { message: 'Jadwal operasi diupdate' };
    }
};
exports.InpatientService = InpatientService;
exports.InpatientService = InpatientService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], InpatientService);
let InpatientController = class InpatientController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    getBeds(rc, st) { return this.svc.getBedStatus(rc, st); }
    getBedSummary() { return this.svc.getBedSummary(); }
    admit(dto, uid) { return this.svc.admit(dto, uid); }
    getActive(p = 1, l = 20) { return this.svc.getActiveAdmissions(+p, +l); }
    getOne(id) { return this.svc.getAdmission(id); }
    transfer(id, dto, uid) {
        return this.svc.transferBed(id, dto, uid);
    }
    discharge(id, dto) { return this.svc.discharge(id, dto); }
    addCppt(id, dto, uid) {
        return this.svc.addCppt(id, dto, uid);
    }
    getCppt(id) { return this.svc.getCppt(id); }
    verifyCppt(id, uid) { return this.svc.verifyCppt(id, uid); }
    triage(id, dto, uid) {
        return this.svc.createTriage(id, dto, uid);
    }
    igdQueue() { return this.svc.getIgdQueue(); }
    schedule(dto, uid) { return this.svc.scheduleSurgery(dto, uid); }
    getSurgeries(d, s, r) {
        return this.svc.getSurgeries(d, s, r);
    }
    updateSurgery(id, dto) { return this.svc.updateSurgery(id, dto); }
};
exports.InpatientController = InpatientController;
__decorate([
    (0, common_2.Get)('beds'),
    (0, swagger_2.ApiOperation)({ summary: 'Status tempat tidur' }),
    __param(0, (0, common_2.Query)('roomClass')),
    __param(1, (0, common_2.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "getBeds", null);
__decorate([
    (0, common_2.Get)('beds/summary'),
    (0, swagger_2.ApiOperation)({ summary: 'Ringkasan kapasitas bed' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "getBedSummary", null);
__decorate([
    (0, common_2.Post)('admissions'),
    (0, swagger_2.ApiOperation)({ summary: 'Rawat inap pasien' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAdmissionDto, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "admit", null);
__decorate([
    (0, common_2.Get)('admissions'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar pasien rawat inap aktif' }),
    __param(0, (0, common_2.Query)('page')),
    __param(1, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "getActive", null);
__decorate([
    (0, common_2.Get)('admissions/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Detail rawat inap' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "getOne", null);
__decorate([
    (0, common_2.Post)('admissions/:id/transfer'),
    (0, swagger_2.ApiOperation)({ summary: 'Transfer bed' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, TransferBedDto, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "transfer", null);
__decorate([
    (0, common_2.Post)('admissions/:id/discharge'),
    (0, swagger_2.ApiOperation)({ summary: 'Pulangkan pasien' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, DischargeDto]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "discharge", null);
__decorate([
    (0, common_2.Post)('admissions/:id/cppt'),
    (0, swagger_2.ApiOperation)({ summary: 'Tambah CPPT' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CpptEntryDto, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "addCppt", null);
__decorate([
    (0, common_2.Get)('admissions/:id/cppt'),
    (0, swagger_2.ApiOperation)({ summary: 'Lihat CPPT' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "getCppt", null);
__decorate([
    (0, common_2.Patch)('cppt/:entryId/verify'),
    (0, swagger_2.ApiOperation)({ summary: 'Verifikasi CPPT' }),
    __param(0, (0, common_2.Param)('entryId')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "verifyCppt", null);
__decorate([
    (0, common_2.Post)('igd/triage/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Input triage IGD' }),
    __param(0, (0, common_2.Param)('visitId')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, TriageDto, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "triage", null);
__decorate([
    (0, common_2.Get)('igd/queue'),
    (0, swagger_2.ApiOperation)({ summary: 'Antrian IGD hari ini' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "igdQueue", null);
__decorate([
    (0, common_2.Post)('surgery'),
    (0, swagger_2.ApiOperation)({ summary: 'Jadwalkan operasi' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSurgeryDto, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "schedule", null);
__decorate([
    (0, common_2.Get)('surgery'),
    (0, swagger_2.ApiOperation)({ summary: 'Jadwal operasi' }),
    __param(0, (0, common_2.Query)('date')),
    __param(1, (0, common_2.Query)('status')),
    __param(2, (0, common_2.Query)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "getSurgeries", null);
__decorate([
    (0, common_2.Patch)('surgery/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Update laporan operasi' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSurgeryDto]),
    __metadata("design:returntype", void 0)
], InpatientController.prototype, "updateSurgery", null);
exports.InpatientController = InpatientController = __decorate([
    (0, swagger_2.ApiTags)('Inpatient & Surgery'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('inpatient'),
    __metadata("design:paramtypes", [InpatientService])
], InpatientController);
let InpatientModule = class InpatientModule {
};
exports.InpatientModule = InpatientModule;
exports.InpatientModule = InpatientModule = __decorate([
    (0, common_3.Module)({
        controllers: [InpatientController],
        providers: [InpatientService],
        exports: [InpatientService],
    })
], InpatientModule);
//# sourceMappingURL=inpatient.module.js.map