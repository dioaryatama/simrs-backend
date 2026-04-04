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
exports.PatientsModule = exports.PatientsController = exports.PatientsService = exports.PatientQueryDto = exports.UpdatePatientDto = exports.CreatePatientDto = exports.Patient = void 0;
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
let Patient = class Patient {
    id;
    medicalRecordNo;
    nik;
    bpjsNumber;
    fullName;
    dateOfBirth;
    gender;
    bloodType;
    religion;
    maritalStatus;
    occupation;
    phone;
    email;
    addressId;
    emergencyContactName;
    emergencyContactPhone;
    emergencyContactRel;
    allergyNotes;
    notes;
    isActive;
    dataCompleteness;
    createdAt;
    updatedAt;
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Patient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'medical_record_no', length: 20 }),
    __metadata("design:type", String)
], Patient.prototype, "medicalRecordNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "nik", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bpjs_number', length: 20, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "bpjsNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', length: 150 }),
    __metadata("design:type", String)
], Patient.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Patient.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'blood_type', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "bloodType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "religion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'marital_status', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "maritalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "occupation", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_id', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "addressId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_phone', length: 20, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'emergency_contact_rel', length: 30, nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "emergencyContactRel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allergy_notes', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "allergyNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Patient.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_completeness', type: 'smallint', default: 100 }),
    __metadata("design:type", Number)
], Patient.prototype, "dataCompleteness", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Patient.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Patient.prototype, "updatedAt", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)('patients')
], Patient);
class CreatePatientDto {
    nik;
    bpjsNumber;
    fullName;
    dateOfBirth;
    gender;
    bloodType;
    religion;
    maritalStatus;
    occupation;
    phone;
    email;
    emergencyContactName;
    emergencyContactPhone;
    emergencyContactRel;
    allergyNotes;
    notes;
    street;
    rtRw;
    postalCode;
    villageId;
}
exports.CreatePatientDto = CreatePatientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(16),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "nik", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "bpjsNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['male', 'female'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['male', 'female']),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "bloodType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "religion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "maritalStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "emergencyContactRel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "allergyNotes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "street", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "rtRw", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePatientDto.prototype, "villageId", void 0);
class UpdatePatientDto extends CreatePatientDto {
}
exports.UpdatePatientDto = UpdatePatientDto;
class PatientQueryDto {
    page = 1;
    limit = 20;
    search;
    bpjsNumber;
    nik;
    isActive;
}
exports.PatientQueryDto = PatientQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PatientQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PatientQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientQueryDto.prototype, "bpjsNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PatientQueryDto.prototype, "nik", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PatientQueryDto.prototype, "isActive", void 0);
let PatientsService = class PatientsService {
    repo;
    ds;
    constructor(repo, ds) {
        this.repo = repo;
        this.ds = ds;
    }
    async generateMRNo() {
        const prefix = 'RM';
        const row = await this.ds.query(`SELECT MAX(SUBSTRING(medical_record_no, ${prefix.length + 1})::integer) AS max_no
       FROM patients WHERE medical_record_no LIKE '${prefix}%'`);
        const next = (parseInt(row[0]?.max_no || '0') + 1);
        return prefix + String(next).padStart(7, '0');
    }
    async create(dto) {
        if (dto.nik) {
            const dup = await this.repo.findOneBy({ nik: dto.nik });
            if (dup)
                throw new common_1.ConflictException(`NIK ${dto.nik} sudah terdaftar (RM: ${dup.medicalRecordNo})`);
        }
        let addressId = null;
        if (dto.street || dto.villageId) {
            const addr = await this.ds.query(`INSERT INTO addresses (street, rt_rw, postal_code, village_id)
         VALUES ($1,$2,$3,$4) RETURNING id`, [dto.street, dto.rtRw, dto.postalCode, dto.villageId]);
            addressId = addr[0].id;
        }
        const mrNo = await this.generateMRNo();
        const p = this.repo.create({
            medicalRecordNo: mrNo, nik: dto.nik, bpjsNumber: dto.bpjsNumber,
            fullName: dto.fullName, dateOfBirth: dto.dateOfBirth,
            gender: dto.gender, bloodType: dto.bloodType, religion: dto.religion,
            maritalStatus: dto.maritalStatus, occupation: dto.occupation,
            phone: dto.phone, email: dto.email, addressId,
            emergencyContactName: dto.emergencyContactName,
            emergencyContactPhone: dto.emergencyContactPhone,
            emergencyContactRel: dto.emergencyContactRel,
            allergyNotes: dto.allergyNotes, notes: dto.notes,
        });
        return this.repo.save(p);
    }
    async findAll(q) {
        const page = q.page ?? 1;
        const limit = q.limit ?? 20;
        const offset = (page - 1) * limit;
        let where = `WHERE p.is_active = true`;
        const params = [];
        if (q.search) {
            params.push(`%${q.search}%`);
            where += ` AND (p.full_name ILIKE $${params.length} OR p.medical_record_no ILIKE $${params.length})`;
        }
        if (q.nik) {
            params.push(q.nik);
            where += ` AND p.nik = $${params.length}`;
        }
        if (q.bpjsNumber) {
            params.push(q.bpjsNumber);
            where += ` AND p.bpjs_number = $${params.length}`;
        }
        const [rows, cnt] = await Promise.all([
            this.ds.query(`SELECT p.id, p.medical_record_no, p.nik, p.bpjs_number,
                p.full_name, p.date_of_birth, p.gender, p.blood_type,
                p.phone, p.is_active, p.data_completeness,
                a.street, r.name AS village
         FROM patients p
         LEFT JOIN addresses a ON a.id = p.address_id
         LEFT JOIN regions r ON r.id = a.village_id
         ${where} ORDER BY p.created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]),
            this.ds.query(`SELECT COUNT(*) FROM patients p ${where}`, params),
        ]);
        return { data: rows, total: +cnt[0].count, page, limit, totalPages: Math.ceil(+cnt[0].count / limit) };
    }
    async findOne(id) {
        const rows = await this.ds.query(`SELECT p.*, a.street, a.rt_rw, a.postal_code, a.latitude, a.longitude,
              r_vil.name AS village, r_dis.name AS district,
              r_cit.name AS city, r_pro.name AS province
       FROM patients p
       LEFT JOIN addresses a ON a.id = p.address_id
       LEFT JOIN regions r_vil ON r_vil.id = a.village_id
       LEFT JOIN regions r_dis ON r_dis.id = r_vil.parent_id
       LEFT JOIN regions r_cit ON r_cit.id = r_dis.parent_id
       LEFT JOIN regions r_pro ON r_pro.id = r_cit.parent_id
       WHERE p.id = $1`, [id]);
        if (!rows[0])
            throw new common_1.NotFoundException('Pasien tidak ditemukan');
        return rows[0];
    }
    async findByMR(mrNo) {
        const p = await this.repo.findOneBy({ medicalRecordNo: mrNo });
        if (!p)
            throw new common_1.NotFoundException(`Nomor RM ${mrNo} tidak ditemukan`);
        return this.findOne(p.id);
    }
    async update(id, dto) {
        const p = await this.repo.findOneBy({ id });
        if (!p)
            throw new common_1.NotFoundException('Pasien tidak ditemukan');
        Object.assign(p, {
            fullName: dto.fullName ?? p.fullName,
            nik: dto.nik ?? p.nik, bpjsNumber: dto.bpjsNumber ?? p.bpjsNumber,
            dateOfBirth: dto.dateOfBirth ?? p.dateOfBirth,
            gender: dto.gender ?? p.gender, bloodType: dto.bloodType ?? p.bloodType,
            religion: dto.religion ?? p.religion, phone: dto.phone ?? p.phone,
            email: dto.email ?? p.email, occupation: dto.occupation ?? p.occupation,
            maritalStatus: dto.maritalStatus ?? p.maritalStatus,
            allergyNotes: dto.allergyNotes ?? p.allergyNotes,
            notes: dto.notes ?? p.notes,
            emergencyContactName: dto.emergencyContactName ?? p.emergencyContactName,
            emergencyContactPhone: dto.emergencyContactPhone ?? p.emergencyContactPhone,
            emergencyContactRel: dto.emergencyContactRel ?? p.emergencyContactRel,
        });
        return this.repo.save(p);
    }
    async getVisitHistory(patientId, limit = 10) {
        return this.ds.query(`SELECT v.id, v.visit_number, v.visit_date, v.visit_type, v.visit_status,
              c.name AS clinic_name, e.full_name AS doctor_name,
              ps.name AS scheme_name,
              ARRAY_AGG(DISTINCT d.name_id) AS diagnoses
       FROM visits v
       JOIN clinics c ON c.id = v.clinic_id
       LEFT JOIN doctors doc ON doc.id = v.doctor_id
       LEFT JOIN employees e ON e.id = doc.employee_id
       JOIN payment_schemes ps ON ps.id = v.payment_scheme_id
       LEFT JOIN visit_diagnoses vd ON vd.visit_id = v.id
       LEFT JOIN icd10_diagnoses d ON d.id = vd.icd10_id
       WHERE v.patient_id = $1
       GROUP BY v.id, c.name, e.full_name, ps.name
       ORDER BY v.visit_date DESC LIMIT $2`, [patientId, limit]);
    }
    async getAllergies(patientId) {
        return this.ds.query(`SELECT pa.*, dr.generic_name AS drug_name
       FROM patient_allergies pa
       LEFT JOIN drugs dr ON dr.id = pa.drug_id
       WHERE pa.patient_id = $1 AND pa.is_active = true
       ORDER BY pa.reported_at DESC`, [patientId]);
    }
    async addAllergy(patientId, body, userId) {
        await this.ds.query(`INSERT INTO patient_allergies
         (patient_id, allergy_type, allergen, drug_id, reaction, severity, reported_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`, [patientId, body.allergyType, body.allergen, body.drugId,
            body.reaction, body.severity, userId]);
        return { message: 'Alergi berhasil ditambahkan' };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(Patient)),
    __metadata("design:paramtypes", [typeorm_3.Repository,
        typeorm_3.DataSource])
], PatientsService);
let PatientsController = class PatientsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    create(dto) { return this.svc.create(dto); }
    findAll(q) { return this.svc.findAll(q); }
    findByMR(mrNo) { return this.svc.findByMR(mrNo); }
    findOne(id) { return this.svc.findOne(id); }
    update(id, dto) {
        return this.svc.update(id, dto);
    }
    getVisits(id, limit = 10) {
        return this.svc.getVisitHistory(id, +limit);
    }
    getAllergies(id) { return this.svc.getAllergies(id); }
    addAllergy(id, body, userId) { return this.svc.addAllergy(id, body, userId); }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_2.Post)(),
    (0, swagger_2.ApiOperation)({ summary: 'Daftarkan pasien baru, generate nomor RM otomatis' }),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_2.Get)(),
    (0, swagger_2.ApiOperation)({ summary: 'Cari pasien (nama, RM, NIK, BPJS)' }),
    __param(0, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PatientQueryDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_2.Get)('mr/:mrNo'),
    (0, swagger_2.ApiOperation)({ summary: 'Cari pasien berdasarkan nomor RM' }),
    __param(0, (0, common_2.Param)('mrNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findByMR", null);
__decorate([
    (0, common_2.Get)(':id'),
    (0, swagger_2.ApiOperation)({ summary: 'Detail pasien lengkap dengan alamat' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findOne", null);
__decorate([
    (0, common_2.Put)(':id'),
    (0, swagger_2.ApiOperation)({ summary: 'Update data pasien' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePatientDto]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_2.Get)(':id/visits'),
    (0, swagger_2.ApiOperation)({ summary: 'Riwayat kunjungan pasien' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getVisits", null);
__decorate([
    (0, common_2.Get)(':id/allergies'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar alergi pasien' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "getAllergies", null);
__decorate([
    (0, common_2.Post)(':id/allergies'),
    (0, swagger_2.ApiOperation)({ summary: 'Tambah alergi pasien' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "addAllergy", null);
exports.PatientsController = PatientsController = __decorate([
    (0, swagger_2.ApiTags)('Patients'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('patients'),
    __metadata("design:paramtypes", [PatientsService])
], PatientsController);
let PatientsModule = class PatientsModule {
};
exports.PatientsModule = PatientsModule;
exports.PatientsModule = PatientsModule = __decorate([
    (0, common_3.Module)({
        imports: [typeorm_4.TypeOrmModule.forFeature([Patient])],
        controllers: [PatientsController],
        providers: [PatientsService],
        exports: [PatientsService],
    })
], PatientsModule);
//# sourceMappingURL=patients.module.js.map