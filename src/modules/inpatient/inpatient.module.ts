import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IsUUID, IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators';

// ── DTOs ──────────────────────────────────────────────────────────
export class CreateAdmissionDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiProperty() @IsUUID() bedId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() dpjpDoctorId?: string;
  @ApiPropertyOptional({ enum: ['elective','emergency','referral'] })
  @IsOptional() admissionType?: string;
  @ApiPropertyOptional() @IsOptional() admissionDiagnosis?: string;
  @ApiPropertyOptional() @IsOptional() expectedLosDays?: number;
}

export class TransferBedDto {
  @ApiProperty() @IsUUID() toBedId: string;
  @ApiPropertyOptional() @IsOptional() reason?: string;
}

export class DischargeDto {
  @ApiPropertyOptional({ enum: ['cured','improved','referred','ama','deceased'] })
  @IsOptional() dischargeType?: string;
  @ApiPropertyOptional() @IsOptional() dischargeSummary?: string;
  @ApiPropertyOptional() @IsOptional() dischargeDiagnosis?: string;
}

export class CpptEntryDto {
  @ApiPropertyOptional({ enum: ['doctor','nurse','pharmacist','other'] })
  @IsOptional() entryType?: string;
  @ApiPropertyOptional() @IsOptional() soapS?: string;
  @ApiPropertyOptional() @IsOptional() soapO?: string;
  @ApiPropertyOptional() @IsOptional() soapA?: string;
  @ApiPropertyOptional() @IsOptional() soapP?: string;
}

export class TriageDto {
  @ApiProperty({ minimum: 1, maximum: 5 }) @IsNumber() triageLevel: number;
  @ApiPropertyOptional({ enum: ['ambulance','walk_in','referral','police'] })
  @IsOptional() arrivalMode?: string;
  @ApiProperty() @IsString() chiefComplaint: string;
  @ApiPropertyOptional() @IsOptional() mechanism?: string;
  @ApiPropertyOptional() @IsOptional() isTrauma?: boolean;
  @ApiPropertyOptional() @IsOptional() gcsEye?: number;
  @ApiPropertyOptional() @IsOptional() gcsVerbal?: number;
  @ApiPropertyOptional() @IsOptional() gcsMotor?: number;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class CreateSurgeryDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiProperty() @IsUUID() operatingRoomId: string;
  @ApiProperty() @IsUUID() serviceId: string;
  @ApiProperty() @IsUUID() surgeonId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() anesthesiologistId?: string;
  @ApiPropertyOptional() @IsOptional() anesthesiaType?: string;
  @ApiProperty() scheduledStart: string;
  @ApiProperty() scheduledEnd: string;
  @ApiPropertyOptional() @IsOptional() preOpDiagnosis?: string;
  @ApiPropertyOptional() @IsOptional() assistantIds?: string[];
}

export class UpdateSurgeryDto {
  @ApiPropertyOptional() @IsOptional() actualStart?: string;
  @ApiPropertyOptional() @IsOptional() actualEnd?: string;
  @ApiPropertyOptional({ enum: ['scheduled','in_progress','done','postponed','cancelled'] })
  @IsOptional() status?: string;
  @ApiPropertyOptional() @IsOptional() postOpDiagnosis?: string;
  @ApiPropertyOptional() @IsOptional() procedurePerformed?: string;
  @ApiPropertyOptional() @IsOptional() findings?: string;
  @ApiPropertyOptional() @IsOptional() bloodLossMl?: number;
}

// ── Service ───────────────────────────────────────────────────────
@Injectable()
export class InpatientService {
  constructor(private ds: DataSource) {}

  // ── Beds ──────────────────────────────────────────────────────
  async getBedStatus(roomClass?: string, status?: string, buildingFloor?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (roomClass) { p.push(roomClass); where += ` AND r.room_class=$${p.length}`; }
    if (status)    { p.push(status);    where += ` AND bs.status=$${p.length}`; }

    return this.ds.query(
      `SELECT b.id, b.bed_number, b.bed_class, r.building, r.floor,
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
       ORDER BY r.building, r.floor, b.bed_number`, p,
    );
  }

  async getBedSummary() {
    return this.ds.query(
      `SELECT bed_class, status, COUNT(*) AS count
       FROM beds b LEFT JOIN bed_status bs ON bs.bed_id = b.id
       GROUP BY bed_class, status ORDER BY bed_class, status`,
    );
  }

  // ── Admission ─────────────────────────────────────────────────
  async admit(dto: CreateAdmissionDto, userId: string) {
    const [bed] = await this.ds.query(`SELECT * FROM bed_status WHERE bed_id=$1`, [dto.bedId]);
    if (bed?.status === 'occupied') throw new BadRequestException('Bed sudah terisi');

    const d = new Date();
    const prefix = `ADM-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM admissions WHERE admission_no LIKE '${prefix}%'`);
    const admNo = prefix + String(cnt.n).padStart(3,'0');

    const [visit] = await this.ds.query(`SELECT patient_id, doctor_id FROM visits WHERE id=$1`, [dto.visitId]);
    if (!visit) throw new NotFoundException('Kunjungan tidak ditemukan');

    const [adm] = await this.ds.query(
      `INSERT INTO admissions
         (admission_no, visit_id, patient_id, bed_id, admitting_doctor_id, dpjp_doctor_id,
          admission_type, admission_status, admission_diagnosis, expected_los_days)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'active',$8,$9) RETURNING *`,
      [admNo, dto.visitId, visit.patient_id, dto.bedId,
       visit.doctor_id, dto.dpjpDoctorId||visit.doctor_id,
       dto.admissionType||'elective', dto.admissionDiagnosis, dto.expectedLosDays],
    );
    await this.ds.query(
      `INSERT INTO bed_status (bed_id, status, admission_id)
       VALUES ($1,'occupied',$2)
       ON CONFLICT (bed_id) DO UPDATE SET status='occupied', admission_id=$2`,
      [dto.bedId, adm.id],
    );
    return { ...adm, message: 'Pasien berhasil dirawat inap' };
  }

  async getActiveAdmissions(page = 1, limit = 20) {
    const offset = (page-1)*limit;
    return this.ds.query(
      `SELECT a.id, a.admission_no, a.admission_date, a.actual_los_days,
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
       ORDER BY a.admission_date DESC LIMIT $1 OFFSET $2`, [limit, offset],
    );
  }

  async getAdmission(id: string) {
    const [row] = await this.ds.query(
      `SELECT a.*, p.full_name AS patient_name, p.medical_record_no,
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
       WHERE a.id=$1`, [id],
    );
    if (!row) throw new NotFoundException('Data rawat inap tidak ditemukan');
    return row;
  }

  async transferBed(admId: string, dto: TransferBedDto, userId: string) {
    const [adm] = await this.ds.query(`SELECT * FROM admissions WHERE id=$1`, [admId]);
    if (!adm) throw new NotFoundException();
    const [newBed] = await this.ds.query(`SELECT * FROM bed_status WHERE bed_id=$1`, [dto.toBedId]);
    if (newBed?.status === 'occupied') throw new BadRequestException('Bed tujuan sudah terisi');

    await this.ds.query(
      `INSERT INTO bed_transfers (admission_id, from_bed_id, to_bed_id, transfer_reason, transferred_by)
       VALUES ($1,$2,$3,$4,$5)`,
      [admId, adm.bed_id, dto.toBedId, dto.reason, userId],
    );
    await this.ds.query(`UPDATE admissions SET bed_id=$1 WHERE id=$2`, [dto.toBedId, admId]);
    await this.ds.query(`UPDATE bed_status SET status='available', admission_id=NULL WHERE bed_id=$1`, [adm.bed_id]);
    await this.ds.query(
      `INSERT INTO bed_status (bed_id, status, admission_id) VALUES ($1,'occupied',$2)
       ON CONFLICT (bed_id) DO UPDATE SET status='occupied', admission_id=$2`,
      [dto.toBedId, admId],
    );
    return { message: 'Transfer bed berhasil' };
  }

  async discharge(admId: string, dto: DischargeDto) {
    const [adm] = await this.ds.query(`SELECT * FROM admissions WHERE id=$1`, [admId]);
    if (!adm) throw new NotFoundException();
    await this.ds.query(
      `UPDATE admissions SET discharge_date=NOW(), admission_status='discharged',
         discharge_type=$1, discharge_summary=$2, discharge_diagnosis=$3
       WHERE id=$4`,
      [dto.dischargeType||'cured', dto.dischargeSummary, dto.dischargeDiagnosis, admId],
    );
    await this.ds.query(
      `UPDATE bed_status SET status='cleaning', admission_id=NULL WHERE bed_id=$1`, [adm.bed_id],
    );
    await this.ds.query(
      `UPDATE visits SET visit_status='done', checkout_at=NOW() WHERE id=$1`, [adm.visit_id],
    );
    return { message: 'Pasien berhasil dipulangkan' };
  }

  // ── CPPT ─────────────────────────────────────────────────────
  async addCppt(admId: string, dto: CpptEntryDto, userId: string) {
    const [row] = await this.ds.query(
      `INSERT INTO cppt_entries (admission_id, entry_type, soap_s, soap_o, soap_a, soap_p, written_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [admId, dto.entryType||'doctor', dto.soapS, dto.soapO, dto.soapA, dto.soapP, userId],
    );
    return row;
  }

  async getCppt(admId: string) {
    return this.ds.query(
      `SELECT ce.*, u.full_name AS written_by_name
       FROM cppt_entries ce JOIN users u ON u.id = ce.written_by
       WHERE ce.admission_id=$1 ORDER BY ce.entry_datetime`, [admId],
    );
  }

  async verifyCppt(entryId: string, userId: string) {
    await this.ds.query(
      `UPDATE cppt_entries SET is_verified=true, verified_by=$1, verified_at=NOW() WHERE id=$2`,
      [userId, entryId],
    );
    return { message: 'CPPT diverifikasi' };
  }

  // ── IGD Triage ────────────────────────────────────────────────
  async createTriage(visitId: string, dto: TriageDto, userId: string) {
    const [row] = await this.ds.query(
      `INSERT INTO igd_triages
         (visit_id, triage_level, arrival_mode, triaged_by, chief_complaint,
          mechanism, is_trauma, gcs_eye, gcs_verbal, gcs_motor, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (visit_id) DO UPDATE SET
         triage_level=$2, chief_complaint=$5, notes=$11
       RETURNING *`,
      [visitId, dto.triageLevel, dto.arrivalMode, userId, dto.chiefComplaint,
       dto.mechanism, dto.isTrauma||false, dto.gcsEye, dto.gcsVerbal, dto.gcsMotor, dto.notes],
    );
    return row;
  }

  async getIgdQueue() {
    return this.ds.query(
      `SELECT v.id, v.visit_number, v.visit_status, v.queue_number,
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
       ORDER BY t.triage_level NULLS LAST, t.arrival_at`,
    );
  }

  // ── Surgery ───────────────────────────────────────────────────
  async scheduleSurgery(dto: CreateSurgeryDto, userId: string) {
    const d = new Date();
    const prefix = `OK-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM surgery_schedules WHERE schedule_no LIKE '${prefix}%'`);
    const no = prefix + String(cnt.n).padStart(4,'0');

    const [visit] = await this.ds.query(`SELECT patient_id FROM visits WHERE id=$1`, [dto.visitId]);
    const [row] = await this.ds.query(
      `INSERT INTO surgery_schedules
         (schedule_no, visit_id, patient_id, operating_room_id, surgeon_id,
          anesthesiologist_id, anesthesia_type, service_id,
          scheduled_start, scheduled_end, pre_op_diagnosis,
          assistant_ids, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'scheduled',$13) RETURNING *`,
      [no, dto.visitId, visit.patient_id, dto.operatingRoomId, dto.surgeonId,
       dto.anesthesiologistId, dto.anesthesiaType, dto.serviceId,
       dto.scheduledStart, dto.scheduledEnd, dto.preOpDiagnosis,
       JSON.stringify(dto.assistantIds||[]), userId],
    );
    return { ...row, message: 'Jadwal operasi berhasil dibuat' };
  }

  async getSurgeries(date?: string, status?: string, roomId?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (date)   { p.push(date);   where += ` AND DATE(ss.scheduled_start)=$${p.length}`; }
    if (status) { p.push(status); where += ` AND ss.status=$${p.length}`; }
    if (roomId) { p.push(roomId); where += ` AND ss.operating_room_id=$${p.length}`; }

    return this.ds.query(
      `SELECT ss.id, ss.schedule_no, ss.scheduled_start, ss.scheduled_end,
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
       ${where} ORDER BY ss.scheduled_start`, p,
    );
  }

  async updateSurgery(id: string, dto: UpdateSurgeryDto) {
    const fields: string[] = [];
    const vals: any[] = [];
    const add = (f: string, v: any) => { if (v !== undefined) { vals.push(v); fields.push(`${f}=$${vals.length}`); } };
    add('actual_start', dto.actualStart); add('actual_end', dto.actualEnd);
    add('status', dto.status); add('post_op_diagnosis', dto.postOpDiagnosis);
    add('procedure_performed', dto.procedurePerformed);
    add('findings', dto.findings); add('blood_loss_ml', dto.bloodLossMl);
    if (!fields.length) return { message: 'Tidak ada perubahan' };
    vals.push(id);
    await this.ds.query(`UPDATE surgery_schedules SET ${fields.join(',')} WHERE id=$${vals.length}`, vals);
    return { message: 'Jadwal operasi diupdate' };
  }
}

// ── Controller ────────────────────────────────────────────────────
@ApiTags('Inpatient & Surgery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inpatient')
export class InpatientController {
  constructor(private readonly svc: InpatientService) {}

  @Get('beds') @ApiOperation({ summary: 'Status tempat tidur' })
  getBeds(@Query('roomClass') rc?: string, @Query('status') st?: string) { return this.svc.getBedStatus(rc, st); }
  @Get('beds/summary') @ApiOperation({ summary: 'Ringkasan kapasitas bed' })
  getBedSummary() { return this.svc.getBedSummary(); }

  @Post('admissions') @ApiOperation({ summary: 'Rawat inap pasien' })
  admit(@Body() dto: CreateAdmissionDto, @CurrentUser('id') uid: string) { return this.svc.admit(dto, uid); }
  @Get('admissions') @ApiOperation({ summary: 'Daftar pasien rawat inap aktif' })
  getActive(@Query('page') p = 1, @Query('limit') l = 20) { return this.svc.getActiveAdmissions(+p, +l); }
  @Get('admissions/:id') @ApiOperation({ summary: 'Detail rawat inap' })
  getOne(@Param('id') id: string) { return this.svc.getAdmission(id); }
  @Post('admissions/:id/transfer') @ApiOperation({ summary: 'Transfer bed' })
  transfer(@Param('id') id: string, @Body() dto: TransferBedDto, @CurrentUser('id') uid: string) {
    return this.svc.transferBed(id, dto, uid);
  }
  @Post('admissions/:id/discharge') @ApiOperation({ summary: 'Pulangkan pasien' })
  discharge(@Param('id') id: string, @Body() dto: DischargeDto) { return this.svc.discharge(id, dto); }

  @Post('admissions/:id/cppt') @ApiOperation({ summary: 'Tambah CPPT' })
  addCppt(@Param('id') id: string, @Body() dto: CpptEntryDto, @CurrentUser('id') uid: string) {
    return this.svc.addCppt(id, dto, uid);
  }
  @Get('admissions/:id/cppt') @ApiOperation({ summary: 'Lihat CPPT' })
  getCppt(@Param('id') id: string) { return this.svc.getCppt(id); }
  @Patch('cppt/:entryId/verify') @ApiOperation({ summary: 'Verifikasi CPPT' })
  verifyCppt(@Param('entryId') id: string, @CurrentUser('id') uid: string) { return this.svc.verifyCppt(id, uid); }

  @Post('igd/triage/:visitId') @ApiOperation({ summary: 'Input triage IGD' })
  triage(@Param('visitId') id: string, @Body() dto: TriageDto, @CurrentUser('id') uid: string) {
    return this.svc.createTriage(id, dto, uid);
  }
  @Get('igd/queue') @ApiOperation({ summary: 'Antrian IGD hari ini' })
  igdQueue() { return this.svc.getIgdQueue(); }

  @Post('surgery') @ApiOperation({ summary: 'Jadwalkan operasi' })
  schedule(@Body() dto: CreateSurgeryDto, @CurrentUser('id') uid: string) { return this.svc.scheduleSurgery(dto, uid); }
  @Get('surgery') @ApiOperation({ summary: 'Jadwal operasi' })
  getSurgeries(@Query('date') d?: string, @Query('status') s?: string, @Query('roomId') r?: string) {
    return this.svc.getSurgeries(d, s, r);
  }
  @Patch('surgery/:id') @ApiOperation({ summary: 'Update laporan operasi' })
  updateSurgery(@Param('id') id: string, @Body() dto: UpdateSurgeryDto) { return this.svc.updateSurgery(id, dto); }
}

@Module({
  controllers: [InpatientController],
  providers: [InpatientService],
  exports: [InpatientService],
})
export class InpatientModule {}
