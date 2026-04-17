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
exports.EmrModule = exports.EmrController = exports.EmrService = exports.CreateProcedureDto = exports.PrescriptionItemDto = exports.CreatePrescriptionDto = exports.CreateRadOrderDto = exports.LabResultDto = exports.CreateLabOrderDto = exports.AddDiagnosisDto = exports.CreateSoapDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const auth_guard_1 = require("../../common/guards/auth.guard");
const decorators_1 = require("../../common/decorators");
class CreateSoapDto {
    visitId;
    noteType;
    subjective;
    objective;
    assessment;
    plan;
    noteContent;
}
exports.CreateSoapDto = CreateSoapDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['soap', 'cppt', 'nursing', 'anesthesia', 'discharge'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "noteType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "subjective", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "objective", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "assessment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSoapDto.prototype, "noteContent", void 0);
class AddDiagnosisDto {
    visitId;
    icd10Id;
    diagnosisType;
    isConfirmed;
    notes;
}
exports.AddDiagnosisDto = AddDiagnosisDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddDiagnosisDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AddDiagnosisDto.prototype, "icd10Id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['primary', 'secondary', 'complication'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddDiagnosisDto.prototype, "diagnosisType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AddDiagnosisDto.prototype, "isConfirmed", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddDiagnosisDto.prototype, "notes", void 0);
class CreateLabOrderDto {
    visitId;
    priority;
    clinicalInfo;
    serviceIds;
}
exports.CreateLabOrderDto = CreateLabOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['routine', 'urgent', 'cito'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLabOrderDto.prototype, "clinicalInfo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Array service_id' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    __metadata("design:type", Array)
], CreateLabOrderDto.prototype, "serviceIds", void 0);
class LabResultDto {
    itemId;
    resultValue;
    resultUnit;
    normalRange;
    resultFlag;
    notes;
}
exports.LabResultDto = LabResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], LabResultDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LabResultDto.prototype, "resultValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LabResultDto.prototype, "resultUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LabResultDto.prototype, "normalRange", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['normal', 'low', 'high', 'critical'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LabResultDto.prototype, "resultFlag", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LabResultDto.prototype, "notes", void 0);
class CreateRadOrderDto {
    visitId;
    serviceId;
    priority;
    clinicalInfo;
}
exports.CreateRadOrderDto = CreateRadOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadOrderDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRadOrderDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['routine', 'urgent', 'cito'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRadOrderDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRadOrderDto.prototype, "clinicalInfo", void 0);
class CreatePrescriptionDto {
    visitId;
    prescriptionType;
    notes;
    items;
}
exports.CreatePrescriptionDto = CreatePrescriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['regular', 'chronic', 'narcotic', 'emergency'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "prescriptionType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePrescriptionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], CreatePrescriptionDto.prototype, "items", void 0);
class PrescriptionItemDto {
    drugId;
    quantity;
    unit;
    dosageInstruction;
    durationDays;
    route;
    isGeneric;
}
exports.PrescriptionItemDto = PrescriptionItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "drugId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PrescriptionItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "dosageInstruction", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], PrescriptionItemDto.prototype, "durationDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PrescriptionItemDto.prototype, "route", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Boolean)
], PrescriptionItemDto.prototype, "isGeneric", void 0);
class CreateProcedureDto {
    visitId;
    serviceId;
    icd9Id;
    quantity;
    notes;
}
exports.CreateProcedureDto = CreateProcedureDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "visitId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "icd9Id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], CreateProcedureDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CreateProcedureDto.prototype, "notes", void 0);
let EmrService = class EmrService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    async createNote(dto, userId) {
        const [v] = await this.ds.query(`SELECT id FROM visits WHERE id=$1`, [dto.visitId]);
        if (!v)
            throw new common_1.NotFoundException('Kunjungan tidak ditemukan');
        const [note] = await this.ds.query(`INSERT INTO medical_notes
         (visit_id, note_type, subjective, objective, assessment, plan, note_content, written_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [dto.visitId, dto.noteType || 'soap', dto.subjective, dto.objective,
            dto.assessment, dto.plan, dto.noteContent, userId]);
        return note;
    }
    async getNotes(visitId) {
        return this.ds.query(`SELECT mn.*, u.full_name AS written_by_name
       FROM medical_notes mn
       JOIN users u ON u.id = mn.written_by
       WHERE mn.visit_id=$1 ORDER BY mn.written_at`, [visitId]);
    }
    async lockNote(noteId) {
        await this.ds.query(`UPDATE medical_notes SET is_locked=true WHERE id=$1`, [noteId]);
        return { message: 'Catatan dikunci' };
    }
    async addDiagnosis(dto, userId) {
        const [row] = await this.ds.query(`INSERT INTO visit_diagnoses (visit_id, icd10_id, diagnosis_type, is_confirmed, noted_by, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING RETURNING *`, [dto.visitId, dto.icd10Id, dto.diagnosisType || 'primary',
            dto.isConfirmed ?? true, userId, dto.notes]);
        return row;
    }
    async getDiagnoses(visitId) {
        return this.ds.query(`SELECT vd.*, i.code AS icd10_code, i.name_id AS diagnosis_name
       FROM visit_diagnoses vd
       JOIN icd10_diagnoses i ON i.id = vd.icd10_id
       WHERE vd.visit_id=$1 ORDER BY vd.noted_at`, [visitId]);
    }
    async removeDiagnosis(diagId) {
        await this.ds.query(`DELETE FROM visit_diagnoses WHERE id=$1`, [diagId]);
        return { message: 'Diagnosa dihapus' };
    }
    async createLabOrder(dto, userId) {
        const d = new Date();
        const prefix = `LAB-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM lab_orders WHERE order_no LIKE '${prefix}%'`);
        const orderNo = prefix + String(cnt.n).padStart(3, '0');
        const [order] = await this.ds.query(`INSERT INTO lab_orders (order_no, visit_id, ordered_by, priority, clinical_info, status)
       SELECT $1, $2, doc.id, $3, $4, 'ordered'
       FROM visits v JOIN doctors doc ON doc.employee_id = (
         SELECT employee_id FROM users WHERE id = $5
       ) WHERE v.id = $2 RETURNING *`, [orderNo, dto.visitId, dto.priority || 'routine', dto.clinicalInfo, userId]);
        let orderId = order?.id;
        if (!orderId) {
            const [o] = await this.ds.query(`INSERT INTO lab_orders (order_no, visit_id, ordered_by, priority, clinical_info, status)
         VALUES ($1,$2,(SELECT doctor_id FROM visits WHERE id=$2),$3,$4,'ordered') RETURNING id`, [orderNo, dto.visitId, dto.priority || 'routine', dto.clinicalInfo]);
            orderId = o.id;
        }
        for (const svcId of dto.serviceIds) {
            await this.ds.query(`INSERT INTO lab_order_items (lab_order_id, service_id, service_name, status)
         SELECT $1, s.id, s.name, 'pending' FROM services s WHERE s.id=$2`, [orderId, svcId]);
        }
        return { orderId, orderNo, message: 'Order lab berhasil dibuat' };
    }
    async getLabOrders(visitId) {
        return this.ds.query(`SELECT lo.*, e.full_name AS ordered_by_name,
              JSON_AGG(JSON_BUILD_OBJECT(
                'id', li.id, 'service_name', li.service_name,
                'status', li.status, 'result_value', li.result_value,
                'result_unit', li.result_unit, 'result_flag', li.result_flag,
                'normal_range', li.normal_range
              )) AS items
       FROM lab_orders lo
       JOIN doctors doc ON doc.id = lo.ordered_by
       JOIN employees e ON e.id = doc.employee_id
       LEFT JOIN lab_order_items li ON li.lab_order_id = lo.id
       WHERE lo.visit_id=$1 GROUP BY lo.id, e.full_name
       ORDER BY lo.ordered_at DESC`, [visitId]);
    }
    async inputLabResult(itemId, dto, userId) {
        await this.ds.query(`UPDATE lab_order_items SET
         result_value=$1, result_unit=$2, normal_range=$3, result_flag=$4,
         result_at=NOW(), notes=$5, status='done', verified_by=$6
       WHERE id=$7`, [dto.resultValue, dto.resultUnit, dto.normalRange,
            dto.resultFlag, dto.notes, userId, itemId]);
        await this.ds.query(`UPDATE lab_orders SET status='done'
       WHERE id=(SELECT lab_order_id FROM lab_order_items WHERE id=$1)
         AND NOT EXISTS (SELECT 1 FROM lab_order_items WHERE lab_order_id=(
           SELECT lab_order_id FROM lab_order_items WHERE id=$1
         ) AND status='pending')`, [itemId]);
        return { message: 'Hasil lab berhasil disimpan' };
    }
    async createRadOrder(dto, userId) {
        const d = new Date();
        const prefix = `RAD-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM radiology_orders WHERE order_no LIKE '${prefix}%'`);
        const orderNo = prefix + String(cnt.n).padStart(3, '0');
        const [row] = await this.ds.query(`INSERT INTO radiology_orders
         (order_no, visit_id, ordered_by, service_id, priority, clinical_info, status)
       VALUES ($1,$2,(SELECT doctor_id FROM visits WHERE id=$2),$3,$4,$5,'ordered')
       RETURNING *`, [orderNo, dto.visitId, dto.serviceId, dto.priority || 'routine', dto.clinicalInfo]);
        return { ...row, message: 'Order radiologi berhasil dibuat' };
    }
    async getRadOrders(visitId) {
        return this.ds.query(`SELECT ro.*, s.name AS service_name,
              e.full_name AS ordered_by_name,
              ex.full_name AS expertise_by_name
       FROM radiology_orders ro
       JOIN services s ON s.id = ro.service_id
       LEFT JOIN doctors doc ON doc.id = ro.ordered_by
       LEFT JOIN employees e ON e.id = doc.employee_id
       LEFT JOIN doctors doc2 ON doc2.id = ro.expertise_by
       LEFT JOIN employees ex ON ex.id = doc2.employee_id
       WHERE ro.visit_id=$1 ORDER BY ro.ordered_at DESC`, [visitId]);
    }
    async inputRadResult(orderId, body, userId) {
        await this.ds.query(`UPDATE radiology_orders SET
         expertise=$1, image_urls=$2, expertise_by=(
           SELECT doc.id FROM doctors doc WHERE doc.employee_id=(
             SELECT employee_id FROM users WHERE id=$3
           ) LIMIT 1
         ),
         expertise_at=NOW(), performed_at=NOW(), performed_by=$3, status='done'
       WHERE id=$4`, [body.expertise, JSON.stringify(body.imageUrls || []), userId, orderId]);
        return { message: 'Hasil radiologi berhasil disimpan' };
    }
    async createPrescription(dto, userId) {
        const d = new Date();
        const prefix = `RX-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM prescriptions WHERE prescription_no LIKE '${prefix}%'`);
        const rxNo = prefix + String(cnt.n).padStart(3, '0');
        const [rx] = await this.ds.query(`INSERT INTO prescriptions (prescription_no, visit_id, prescribed_by, prescription_type, status, notes)
       VALUES ($1,$2,(SELECT doctor_id FROM visits WHERE id=$2),$3,'pending',$4) RETURNING id`, [rxNo, dto.visitId, dto.prescriptionType || 'regular', dto.notes]);
        for (const item of dto.items) {
            await this.ds.query(`INSERT INTO prescription_items
           (prescription_id, drug_id, drug_name, drug_form, strength, quantity, unit,
            dosage_instruction, duration_days, route, is_generic)
         SELECT $1, d.id, d.generic_name, d.drug_form, d.strength, $2, $3, $4, $5, $6, $7
         FROM drugs d WHERE d.id=$8`, [rx.id, item.quantity, item.unit, item.dosageInstruction,
                item.durationDays, item.route, item.isGeneric || false, item.drugId]);
        }
        return { prescriptionId: rx.id, prescriptionNo: rxNo, message: 'Resep berhasil dibuat' };
    }
    async getPrescriptions(visitId) {
        return this.ds.query(`SELECT p.*,
              e.full_name AS doctor_name,
              JSON_AGG(JSON_BUILD_OBJECT(
                'id', pi.id, 'drug_name', pi.drug_name, 'drug_form', pi.drug_form,
                'strength', pi.strength, 'quantity', pi.quantity, 'unit', pi.unit,
                'dosage_instruction', pi.dosage_instruction, 'duration_days', pi.duration_days
              )) AS items
       FROM prescriptions p
       JOIN doctors doc ON doc.id = p.prescribed_by
       JOIN employees e ON e.id = doc.employee_id
       LEFT JOIN prescription_items pi ON pi.prescription_id = p.id
       WHERE p.visit_id=$1 GROUP BY p.id, e.full_name
       ORDER BY p.prescribed_at DESC`, [visitId]);
    }
    async addProcedure(dto, userId) {
        const [row] = await this.ds.query(`INSERT INTO visit_procedures (visit_id, service_id, icd9_id, performed_by, quantity, notes)
       VALUES ($1,$2,$3,(
         SELECT doc.id FROM doctors doc WHERE doc.employee_id=(
           SELECT employee_id FROM users WHERE id=$4
         ) LIMIT 1
       ),$5,$6) RETURNING *`, [dto.visitId, dto.serviceId, dto.icd9Id, userId, dto.quantity || 1, dto.notes]);
        return row;
    }
    async getProcedures(visitId) {
        return this.ds.query(`SELECT vp.*, s.name AS service_name, s.service_type,
              i9.code AS icd9_code, i9.name_id AS procedure_name,
              e.full_name AS performed_by_name
       FROM visit_procedures vp
       JOIN services s ON s.id = vp.service_id
       LEFT JOIN icd9_procedures i9 ON i9.id = vp.icd9_id
       JOIN doctors doc ON doc.id = vp.performed_by
       JOIN employees e ON e.id = doc.employee_id
       WHERE vp.visit_id=$1 ORDER BY vp.performed_at`, [visitId]);
    }
    async searchIcd10(q, limit = 20) {
        return this.ds.query(`SELECT id, code, name_id, name_en, category
       FROM icd10_diagnoses
       WHERE (code ILIKE $1 OR name_id ILIKE $1) AND is_active=true
       ORDER BY code LIMIT $2`, [`%${q}%`, limit]);
    }
    async searchIcd9(q, limit = 20) {
        return this.ds.query(`SELECT id, code, name_id, name_en FROM icd9_procedures
       WHERE (code ILIKE $1 OR name_id ILIKE $1) AND is_active=true
       ORDER BY code LIMIT $2`, [`%${q}%`, limit]);
    }
};
exports.EmrService = EmrService;
exports.EmrService = EmrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EmrService);
let EmrController = class EmrController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    createNote(dto, uid) { return this.svc.createNote(dto, uid); }
    getNotes(id) { return this.svc.getNotes(id); }
    lockNote(id) { return this.svc.lockNote(id); }
    addDiagnosis(dto, uid) { return this.svc.addDiagnosis(dto, uid); }
    getDiagnoses(id) { return this.svc.getDiagnoses(id); }
    removeDiagnosis(id) { return this.svc.removeDiagnosis(id); }
    createLab(dto, uid) { return this.svc.createLabOrder(dto, uid); }
    getLab(id) { return this.svc.getLabOrders(id); }
    inputLabResult(id, dto, uid) {
        return this.svc.inputLabResult(id, dto, uid);
    }
    createRad(dto, uid) { return this.svc.createRadOrder(dto, uid); }
    getRad(id) { return this.svc.getRadOrders(id); }
    inputRadResult(id, body, uid) {
        return this.svc.inputRadResult(id, body, uid);
    }
    createRx(dto, uid) { return this.svc.createPrescription(dto, uid); }
    getRx(id) { return this.svc.getPrescriptions(id); }
    addProc(dto, uid) { return this.svc.addProcedure(dto, uid); }
    getProcs(id) { return this.svc.getProcedures(id); }
    searchIcd10(q, limit = 20) { return this.svc.searchIcd10(q, +limit); }
    searchIcd9(q, limit = 20) { return this.svc.searchIcd9(q, +limit); }
};
exports.EmrController = EmrController;
__decorate([
    (0, common_2.Post)('notes'),
    (0, swagger_2.ApiOperation)({ summary: 'Tulis SOAP/catatan medis' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSoapDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "createNote", null);
__decorate([
    (0, common_2.Get)('notes/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Catatan medis per kunjungan' }),
    __param(0, (0, common_2.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "getNotes", null);
__decorate([
    (0, common_2.Patch)('notes/:id/lock'),
    (0, swagger_2.ApiOperation)({ summary: 'Kunci catatan medis (final)' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "lockNote", null);
__decorate([
    (0, common_2.Post)('diagnoses'),
    (0, swagger_2.ApiOperation)({ summary: 'Tambah diagnosa ICD-10' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddDiagnosisDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "addDiagnosis", null);
__decorate([
    (0, common_2.Get)('diagnoses/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Diagnosa per kunjungan' }),
    __param(0, (0, common_2.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "getDiagnoses", null);
__decorate([
    (0, common_2.Delete)('diagnoses/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Hapus diagnosa' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "removeDiagnosis", null);
__decorate([
    (0, common_2.Post)('lab-orders'),
    (0, swagger_2.ApiOperation)({ summary: 'Order pemeriksaan lab' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLabOrderDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "createLab", null);
__decorate([
    (0, common_2.Get)('lab-orders/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Order lab per kunjungan' }),
    __param(0, (0, common_2.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "getLab", null);
__decorate([
    (0, common_2.Patch)('lab-orders/items/:itemId/result'),
    (0, swagger_2.ApiOperation)({ summary: 'Input hasil lab' }),
    __param(0, (0, common_2.Param)('itemId')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, LabResultDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "inputLabResult", null);
__decorate([
    (0, common_2.Post)('rad-orders'),
    (0, swagger_2.ApiOperation)({ summary: 'Order pemeriksaan radiologi' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRadOrderDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "createRad", null);
__decorate([
    (0, common_2.Get)('rad-orders/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Order radiologi per kunjungan' }),
    __param(0, (0, common_2.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "getRad", null);
__decorate([
    (0, common_2.Patch)('rad-orders/:id/result'),
    (0, swagger_2.ApiOperation)({ summary: 'Input expertise/hasil radiologi' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "inputRadResult", null);
__decorate([
    (0, common_2.Post)('prescriptions'),
    (0, swagger_2.ApiOperation)({ summary: 'Tulis resep' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePrescriptionDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "createRx", null);
__decorate([
    (0, common_2.Get)('prescriptions/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Resep per kunjungan' }),
    __param(0, (0, common_2.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "getRx", null);
__decorate([
    (0, common_2.Post)('procedures'),
    (0, swagger_2.ApiOperation)({ summary: 'Input tindakan medis' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProcedureDto, String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "addProc", null);
__decorate([
    (0, common_2.Get)('procedures/:visitId'),
    (0, swagger_2.ApiOperation)({ summary: 'Tindakan per kunjungan' }),
    __param(0, (0, common_2.Param)('visitId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "getProcs", null);
__decorate([
    (0, common_2.Get)('icd10'),
    (0, swagger_2.ApiOperation)({ summary: 'Cari kode ICD-10' }),
    __param(0, (0, common_2.Query)('q')),
    __param(1, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "searchIcd10", null);
__decorate([
    (0, common_2.Get)('icd9'),
    (0, swagger_2.ApiOperation)({ summary: 'Cari kode ICD-9-CM prosedur' }),
    __param(0, (0, common_2.Query)('q')),
    __param(1, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmrController.prototype, "searchIcd9", null);
exports.EmrController = EmrController = __decorate([
    (0, swagger_2.ApiTags)('EMR'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('emr'),
    __metadata("design:paramtypes", [EmrService])
], EmrController);
let EmrModule = class EmrModule {
};
exports.EmrModule = EmrModule;
exports.EmrModule = EmrModule = __decorate([
    (0, common_3.Module)({
        controllers: [EmrController],
        providers: [EmrService],
        exports: [EmrService],
    })
], EmrModule);
//# sourceMappingURL=emr.module.js.map