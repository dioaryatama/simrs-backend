// ================================================================
// PATIENTS MODULE
// ================================================================
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';
import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsDateString, IsUUID, MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, ILike } from 'typeorm';
import {
  Controller, Get, Post, Put, Patch, Body,
  Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators';

// ── Entity ───────────────────────────────────────────────────────
@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Index({ unique: true })
  @Column({ name: 'medical_record_no', length: 20 }) medicalRecordNo: string;
  @Column({ length: 16, nullable: true }) nik: string;
  @Column({ name: 'bpjs_number', length: 20, nullable: true }) bpjsNumber: string;
  @Column({ name: 'full_name', length: 150 }) fullName: string;
  @Column({ name: 'date_of_birth', type: 'date', nullable: true }) dateOfBirth: Date;
  @Column({ nullable: true }) gender: string;
  @Column({ name: 'blood_type', nullable: true }) bloodType: string;
  @Column({ nullable: true }) religion: string;
  @Column({ name: 'marital_status', nullable: true }) maritalStatus: string;
  @Column({ nullable: true }) occupation: string;
  @Column({ length: 20, nullable: true }) phone: string;
  @Column({ length: 100, nullable: true }) email: string;
  @Column({ name: 'address_id', nullable: true }) addressId: string;
  @Column({ name: 'emergency_contact_name', length: 100, nullable: true }) emergencyContactName: string;
  @Column({ name: 'emergency_contact_phone', length: 20, nullable: true }) emergencyContactPhone: string;
  @Column({ name: 'emergency_contact_rel', length: 30, nullable: true }) emergencyContactRel: string;
  @Column({ name: 'allergy_notes', nullable: true }) allergyNotes: string;
  @Column({ nullable: true }) notes: string;
  @Column({ name: 'is_active', default: true }) isActive: boolean;
  @Column({ name: 'data_completeness', type: 'smallint', default: 100 }) dataCompleteness: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}

// ── DTOs ─────────────────────────────────────────────────────────
export class CreatePatientDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(16) nik?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bpjsNumber?: string;
  @ApiProperty() @IsString() @IsNotEmpty() fullName: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateOfBirth?: string;
  @ApiPropertyOptional({ enum: ['male','female'] })
  @IsOptional() @IsEnum(['male','female']) gender?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() bloodType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() religion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() maritalStatus?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() occupation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyContactName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyContactPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() emergencyContactRel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() allergyNotes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  // Alamat
  @ApiPropertyOptional() @IsOptional() @IsString() street?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rtRw?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() postalCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() villageId?: string;
}

export class UpdatePatientDto extends CreatePatientDto {}

export class PatientQueryDto {
  @ApiPropertyOptional() @IsOptional() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() limit?: number = 20;
  @ApiPropertyOptional() @IsOptional() search?: string;
  @ApiPropertyOptional() @IsOptional() bpjsNumber?: string;
  @ApiPropertyOptional() @IsOptional() nik?: string;
  @ApiPropertyOptional() @IsOptional() isActive?: boolean;
}

// ── Service ───────────────────────────────────────────────────────
@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private repo: Repository<Patient>,
    private ds: DataSource,
  ) {}

  async generateMRNo(): Promise<string> {
    const prefix = 'RM';
    const row = await this.ds.query(
      `SELECT MAX(SUBSTRING(medical_record_no, ${prefix.length + 1})::integer) AS max_no
       FROM patients WHERE medical_record_no LIKE '${prefix}%'`,
    );
    const next = (parseInt(row[0]?.max_no || '0') + 1);
    return prefix + String(next).padStart(7, '0');
  }

  async create(dto: CreatePatientDto) {
    if (dto.nik) {
      const dup = await this.repo.findOneBy({ nik: dto.nik });
      if (dup) throw new ConflictException(`NIK ${dto.nik} sudah terdaftar (RM: ${dup.medicalRecordNo})`);
    }
    // Buat alamat jika ada
    let addressId: string | null = null;
    if (dto.street || dto.villageId) {
      const addr = await this.ds.query(
        `INSERT INTO addresses (street, rt_rw, postal_code, village_id)
         VALUES ($1,$2,$3,$4) RETURNING id`,
        [dto.street, dto.rtRw, dto.postalCode, dto.villageId],
      );
      addressId = addr[0].id;
    }

    const mrNo = await this.generateMRNo();
    const p: any = this.repo.create({
      medicalRecordNo: mrNo, nik: dto.nik, bpjsNumber: dto.bpjsNumber,
      fullName: dto.fullName, dateOfBirth: dto.dateOfBirth as any,
      gender: dto.gender, bloodType: dto.bloodType, religion: dto.religion,
      maritalStatus: dto.maritalStatus, occupation: dto.occupation,
      phone: dto.phone, email: dto.email, addressId,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      emergencyContactRel: dto.emergencyContactRel,
      allergyNotes: dto.allergyNotes, notes: dto.notes,
    } as any);
    return this.repo.save(p);
  }

  async findAll(q: PatientQueryDto) {
    const page = q.page ?? 1; const limit = q.limit ?? 20;
    const offset = (page - 1) * limit;
    let where = `WHERE p.is_active = true`;
    const params: any[] = [];
    if (q.search) { params.push(`%${q.search}%`); where += ` AND (p.full_name ILIKE $${params.length} OR p.medical_record_no ILIKE $${params.length})`; }
    if (q.nik) { params.push(q.nik); where += ` AND p.nik = $${params.length}`; }
    if (q.bpjsNumber) { params.push(q.bpjsNumber); where += ` AND p.bpjs_number = $${params.length}`; }

    const [rows, cnt] = await Promise.all([
      this.ds.query(
        `SELECT p.id, p.medical_record_no, p.nik, p.bpjs_number,
                p.full_name, p.date_of_birth, p.gender, p.blood_type,
                p.phone, p.is_active, p.data_completeness,
                a.street, r.name AS village
         FROM patients p
         LEFT JOIN addresses a ON a.id = p.address_id
         LEFT JOIN regions r ON r.id = a.village_id
         ${where} ORDER BY p.created_at DESC
         LIMIT $${params.length+1} OFFSET $${params.length+2}`,
        [...params, limit, offset],
      ),
      this.ds.query(`SELECT COUNT(*) FROM patients p ${where}`, params),
    ]);
    return { data: rows, total: +cnt[0].count, page, limit, totalPages: Math.ceil(+cnt[0].count/limit) };
  }

  async findOne(id: string) {
    const rows = await this.ds.query(
      `SELECT p.*, a.street, a.rt_rw, a.postal_code, a.latitude, a.longitude,
              r_vil.name AS village, r_dis.name AS district,
              r_cit.name AS city, r_pro.name AS province
       FROM patients p
       LEFT JOIN addresses a ON a.id = p.address_id
       LEFT JOIN regions r_vil ON r_vil.id = a.village_id
       LEFT JOIN regions r_dis ON r_dis.id = r_vil.parent_id
       LEFT JOIN regions r_cit ON r_cit.id = r_dis.parent_id
       LEFT JOIN regions r_pro ON r_pro.id = r_cit.parent_id
       WHERE p.id = $1`, [id],
    );
    if (!rows[0]) throw new NotFoundException('Pasien tidak ditemukan');
    return rows[0];
  }

  async findByMR(mrNo: string) {
    const p = await this.repo.findOneBy({ medicalRecordNo: mrNo });
    if (!p) throw new NotFoundException(`Nomor RM ${mrNo} tidak ditemukan`);
    return this.findOne(p.id);
  }

  async update(id: string, dto: UpdatePatientDto) {
    const p = await this.repo.findOneBy({ id });
    if (!p) throw new NotFoundException('Pasien tidak ditemukan');
    Object.assign(p as any, {
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

  async getVisitHistory(patientId: string, limit = 10) {
    return this.ds.query(
      `SELECT v.id, v.visit_number, v.visit_date, v.visit_type, v.visit_status,
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
       ORDER BY v.visit_date DESC LIMIT $2`, [patientId, limit],
    );
  }

  async getAllergies(patientId: string) {
    return this.ds.query(
      `SELECT pa.*, dr.generic_name AS drug_name
       FROM patient_allergies pa
       LEFT JOIN drugs dr ON dr.id = pa.drug_id
       WHERE pa.patient_id = $1 AND pa.is_active = true
       ORDER BY pa.reported_at DESC`, [patientId],
    );
  }

  async addAllergy(patientId: string, body: any, userId: string) {
    await this.ds.query(
      `INSERT INTO patient_allergies
         (patient_id, allergy_type, allergen, drug_id, reaction, severity, reported_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [patientId, body.allergyType, body.allergen, body.drugId,
       body.reaction, body.severity, userId],
    );
    return { message: 'Alergi berhasil ditambahkan' };
  }
}

// ── Controller ────────────────────────────────────────────────────
@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly svc: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Daftarkan pasien baru, generate nomor RM otomatis' })
  create(@Body() dto: CreatePatientDto) { return this.svc.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Cari pasien (nama, RM, NIK, BPJS)' })
  findAll(@Query() q: PatientQueryDto) { return this.svc.findAll(q); }

  @Get('mr/:mrNo')
  @ApiOperation({ summary: 'Cari pasien berdasarkan nomor RM' })
  findByMR(@Param('mrNo') mrNo: string) { return this.svc.findByMR(mrNo); }

  @Get(':id')
  @ApiOperation({ summary: 'Detail pasien lengkap dengan alamat' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Update data pasien' })
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.svc.update(id, dto);
  }

  @Get(':id/visits')
  @ApiOperation({ summary: 'Riwayat kunjungan pasien' })
  getVisits(@Param('id') id: string, @Query('limit') limit = 10) {
    return this.svc.getVisitHistory(id, +limit);
  }

  @Get(':id/allergies')
  @ApiOperation({ summary: 'Daftar alergi pasien' })
  getAllergies(@Param('id') id: string) { return this.svc.getAllergies(id); }

  @Post(':id/allergies')
  @ApiOperation({ summary: 'Tambah alergi pasien' })
  addAllergy(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('id') userId: string,
  ) { return this.svc.addAllergy(id, body, userId); }
}

// ── Module ────────────────────────────────────────────────────────
@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
