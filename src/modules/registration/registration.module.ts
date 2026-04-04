import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators';

// ── Entity ────────────────────────────────────────────────────────
@Entity('visits')
export class Visit {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'visit_number', length: 30 }) visitNumber: string;
  @Column({ name: 'patient_id' }) patientId: string;
  @Column({ name: 'visit_date', type: 'date' }) visitDate: Date;
  @Column({ name: 'visit_type', length: 20 }) visitType: string;
  @Column({ name: 'clinic_id' }) clinicId: string;
  @Column({ name: 'doctor_id', nullable: true }) doctorId: string;
  @Column({ name: 'payment_scheme_id' }) paymentSchemeId: string;
  @Column({ name: 'referral_type', nullable: true }) referralType: string;
  @Column({ name: 'referral_number', nullable: true }) referralNumber: string;
  @Column({ name: 'referral_from', nullable: true }) referralFrom: string;
  @Column({ name: 'chief_complaint', nullable: true }) chiefComplaint: string;
  @Column({ name: 'visit_status', default: 'registered' }) visitStatus: string;
  @Column({ name: 'queue_number', nullable: true }) queueNumber: string;
  @Column({ name: 'registered_by', nullable: true }) registeredBy: string;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'appointment_no', length: 20 }) appointmentNo: string;
  @Column({ name: 'patient_id' }) patientId: string;
  @Column({ name: 'doctor_id' }) doctorId: string;
  @Column({ name: 'clinic_id' }) clinicId: string;
  @Column({ name: 'appointment_date', type: 'date' }) appointmentDate: Date;
  @Column({ name: 'time_slot', type: 'time' }) timeSlot: string;
  @Column({ name: 'payment_scheme_id', nullable: true }) paymentSchemeId: string;
  @Column({ default: 'booked' }) status: string;
  @Column({ name: 'booking_channel', default: 'counter' }) bookingChannel: string;
  @Column({ name: 'visit_id', nullable: true }) visitId: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}

// ── DTOs ──────────────────────────────────────────────────────────
export class CreateVisitDto {
  @ApiProperty() @IsUUID() patientId: string;
  @ApiProperty() @IsUUID() clinicId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() doctorId?: string;
  @ApiProperty() @IsUUID() paymentSchemeId: string;
  @ApiProperty({ enum: ['outpatient','inpatient','igd','surgery'] })
  @IsEnum(['outpatient','inpatient','igd','surgery']) visitType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() referralType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() referralNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() referralFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() chiefComplaint?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class CreateAppointmentDto {
  @ApiProperty() @IsUUID() patientId: string;
  @ApiProperty() @IsUUID() doctorId: string;
  @ApiProperty() @IsUUID() clinicId: string;
  @ApiProperty() @IsDateString() appointmentDate: string;
  @ApiProperty({ example: '09:00' }) @IsString() @IsNotEmpty() timeSlot: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() paymentSchemeId?: string;
  @ApiPropertyOptional({ enum: ['counter','online','phone'] })
  @IsOptional() @IsEnum(['counter','online','phone']) bookingChannel?: string;
}

export class UpdateVisitStatusDto {
  @ApiProperty({ enum: ['registered','waiting','in_progress','done','cancelled'] })
  @IsEnum(['registered','waiting','in_progress','done','cancelled'])
  status: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class VitalSignsDto {
  @ApiPropertyOptional() @IsOptional() weightKg?: number;
  @ApiPropertyOptional() @IsOptional() heightCm?: number;
  @ApiPropertyOptional() @IsOptional() systolicBp?: number;
  @ApiPropertyOptional() @IsOptional() diastolicBp?: number;
  @ApiPropertyOptional() @IsOptional() pulseRate?: number;
  @ApiPropertyOptional() @IsOptional() respiratoryRate?: number;
  @ApiPropertyOptional() @IsOptional() temperatureC?: number;
  @ApiPropertyOptional() @IsOptional() spo2Pct?: number;
  @ApiPropertyOptional() @IsOptional() painScale?: number;
  @ApiPropertyOptional() @IsOptional() consciousness?: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

// ── Service ───────────────────────────────────────────────────────
@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Visit) private visitRepo: Repository<Visit>,
    @InjectRepository(Appointment) private apptRepo: Repository<Appointment>,
    private ds: DataSource,
  ) {}

  private async generateVisitNo(): Promise<string> {
    const d = new Date();
    const prefix = `KJG-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const row = await this.ds.query(
      `SELECT COUNT(*)+1 AS seq FROM visits WHERE visit_number LIKE $1`, [`${prefix}%`],
    );
    return prefix + String(row[0].seq).padStart(3, '0');
  }

  private async nextQueueNo(clinicId: string, prefix: string): Promise<string> {
    const today = new Date().toISOString().split('T')[0];
    await this.ds.query(
      `INSERT INTO queue_counters (clinic_id, queue_date, last_number)
       VALUES ($1, $2, 0) ON CONFLICT (clinic_id, queue_date) DO NOTHING`,
      [clinicId, today],
    );
    const row = await this.ds.query(
      `UPDATE queue_counters SET last_number = last_number + 1
       WHERE clinic_id = $1 AND queue_date = $2 RETURNING last_number`,
      [clinicId, today],
    );
    return `${prefix}-${String(row[0].last_number).padStart(3,'0')}`;
  }

  async register(dto: CreateVisitDto, userId: string) {
    // Validasi pasien aktif
    const [patient] = await this.ds.query(
      `SELECT id, medical_record_no, full_name FROM patients WHERE id = $1 AND is_active = true`,
      [dto.patientId],
    );
    if (!patient) throw new NotFoundException('Pasien tidak ditemukan atau tidak aktif');

    // Ambil queue prefix dari clinic
    const [clinic] = await this.ds.query(
      `SELECT code, queue_prefix, name FROM clinics WHERE id = $1`, [dto.clinicId],
    );
    if (!clinic) throw new NotFoundException('Poli tidak ditemukan');

    const visitNo  = await this.generateVisitNo();
    const queueNo  = await this.nextQueueNo(dto.clinicId, clinic.queue_prefix || clinic.code);

    const v = this.visitRepo.create({
      visitNumber: visitNo, patientId: dto.patientId,
      visitDate: new Date() as any, visitType: dto.visitType,
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

  async getTodayQueue(clinicId?: string, status?: string) {
    const today = new Date().toISOString().split('T')[0];
    let where = `v.visit_date = '${today}'`;
    const params: any[] = [];
    if (clinicId) { params.push(clinicId); where += ` AND v.clinic_id = $${params.length}`; }
    if (status)   { params.push(status);   where += ` AND v.visit_status = $${params.length}`; }

    return this.ds.query(
      `SELECT v.id, v.visit_number, v.queue_number, v.visit_status, v.visit_type,
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
       ORDER BY c.code, v.queue_number`, params,
    );
  }

  async getVisit(id: string) {
    const rows = await this.ds.query(
      `SELECT v.*, p.medical_record_no, p.full_name AS patient_name,
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
       WHERE v.id = $1 LIMIT 1`, [id],
    );
    if (!rows[0]) throw new NotFoundException('Kunjungan tidak ditemukan');
    return rows[0];
  }

  async updateStatus(id: string, dto: UpdateVisitStatusDto) {
    const v = await this.visitRepo.findOneBy({ id });
    if (!v) throw new NotFoundException('Kunjungan tidak ditemukan');
    const updates: any = { visitStatus: dto.status };
    if (dto.status === 'in_progress') updates.checkinAt = new Date();
    if (dto.status === 'done') updates.checkoutAt = new Date();
    await this.visitRepo.update(id, updates);
    return { message: `Status kunjungan diupdate ke: ${dto.status}` };
  }

  async addVitals(visitId: string, dto: VitalSignsDto, userId: string) {
    await this.ds.query(
      `INSERT INTO visit_vitals
         (visit_id, measured_by, weight_kg, height_cm, systolic_bp, diastolic_bp,
          pulse_rate, respiratory_rate, temperature_c, spo2_pct, pain_scale, consciousness, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [visitId, userId, dto.weightKg, dto.heightCm, dto.systolicBp,
       dto.diastolicBp, dto.pulseRate, dto.respiratoryRate, dto.temperatureC,
       dto.spo2Pct, dto.painScale, dto.consciousness, dto.notes],
    );
    return { message: 'Vital signs berhasil disimpan' };
  }

  async callQueue(visitId: string) {
    await this.ds.query(
      `UPDATE visits SET queue_called_at = NOW(), visit_status = 'waiting'
       WHERE id = $1 AND visit_status = 'registered'`, [visitId],
    );
    return { message: 'Pasien dipanggil' };
  }

  // ── Appointments ──────────────────────────────────────────────
  async createAppointment(dto: CreateAppointmentDto, userId: string) {
    // Cek konflik jadwal
    const conflict = await this.ds.query(
      `SELECT id FROM appointments
       WHERE doctor_id=$1 AND appointment_date=$2 AND time_slot=$3
         AND status NOT IN ('cancelled','no_show')`,
      [dto.doctorId, dto.appointmentDate, dto.timeSlot],
    );
    if (conflict.length) throw new BadRequestException('Slot waktu sudah terisi');

    const d = new Date(); const prefix = `APT-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM appointments WHERE appointment_no LIKE '${prefix}%'`);
    const no = `${prefix}-${String(cnt.n).padStart(4,'0')}`;

    const a = this.apptRepo.create({
      appointmentNo: no, patientId: dto.patientId, doctorId: dto.doctorId,
      clinicId: dto.clinicId, appointmentDate: dto.appointmentDate as any,
      timeSlot: dto.timeSlot, paymentSchemeId: dto.paymentSchemeId,
      status: 'booked', bookingChannel: dto.bookingChannel || 'counter',
    });
    return this.apptRepo.save(a);
  }

  async getAppointments(date?: string, doctorId?: string, clinicId?: string, status?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (date)     { p.push(date);     where += ` AND a.appointment_date = $${p.length}`; }
    if (doctorId) { p.push(doctorId); where += ` AND a.doctor_id = $${p.length}`; }
    if (clinicId) { p.push(clinicId); where += ` AND a.clinic_id = $${p.length}`; }
    if (status)   { p.push(status);   where += ` AND a.status = $${p.length}`; }

    return this.ds.query(
      `SELECT a.*, p.medical_record_no, p.full_name AS patient_name, p.phone,
              CONCAT(doc.title_prefix,' ',e.full_name,', ',doc.title_suffix) AS doctor_name,
              c.name AS clinic_name
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors doc ON doc.id = a.doctor_id
       JOIN employees e ON e.id = doc.employee_id
       JOIN clinics c ON c.id = a.clinic_id
       ${where} ORDER BY a.appointment_date, a.time_slot`, p,
    );
  }

  async checkInAppointment(apptId: string, userId: string) {
    const [appt] = await this.ds.query(`SELECT * FROM appointments WHERE id=$1`,[apptId]);
    if (!appt) throw new NotFoundException('Booking tidak ditemukan');
    if (appt.status !== 'booked' && appt.status !== 'confirmed')
      throw new BadRequestException('Booking tidak bisa di-check-in');

    // Buat visit
    const visitDto: CreateVisitDto = {
      patientId: appt.patient_id, clinicId: appt.clinic_id,
      doctorId: appt.doctor_id, paymentSchemeId: appt.payment_scheme_id,
      visitType: 'outpatient',
    };
    const visit = await this.register(visitDto, userId);
    await this.apptRepo.update(apptId, { status: 'checked_in', visitId: visit.id });
    return { visit, message: 'Check-in berhasil' };
  }
}

// ── Controller ────────────────────────────────────────────────────
@ApiTags('Registration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('registration')
export class RegistrationController {
  constructor(private readonly svc: RegistrationService) {}

  @Post('visits')
  @ApiOperation({ summary: 'Daftar kunjungan baru' })
  register(@Body() dto: CreateVisitDto, @CurrentUser('id') uid: string) {
    return this.svc.register(dto, uid);
  }

  @Get('visits/today')
  @ApiOperation({ summary: 'Antrian hari ini' })
  todayQueue(
    @Query('clinicId') clinicId?: string,
    @Query('status') status?: string,
  ) { return this.svc.getTodayQueue(clinicId, status); }

  @Get('visits/:id')
  @ApiOperation({ summary: 'Detail kunjungan' })
  getVisit(@Param('id') id: string) { return this.svc.getVisit(id); }

  @Patch('visits/:id/status')
  @ApiOperation({ summary: 'Update status kunjungan' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVisitStatusDto) {
    return this.svc.updateStatus(id, dto);
  }

  @Post('visits/:id/vitals')
  @ApiOperation({ summary: 'Input vital signs' })
  addVitals(@Param('id') id: string, @Body() dto: VitalSignsDto, @CurrentUser('id') uid: string) {
    return this.svc.addVitals(id, dto, uid);
  }

  @Post('visits/:id/call')
  @ApiOperation({ summary: 'Panggil antrian' })
  callQueue(@Param('id') id: string) { return this.svc.callQueue(id); }

  @Post('appointments')
  @ApiOperation({ summary: 'Buat booking online/counter' })
  createAppt(@Body() dto: CreateAppointmentDto, @CurrentUser('id') uid: string) {
    return this.svc.createAppointment(dto, uid);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Daftar booking' })
  getAppts(
    @Query('date') date?: string,
    @Query('doctorId') doctorId?: string,
    @Query('clinicId') clinicId?: string,
    @Query('status') status?: string,
  ) { return this.svc.getAppointments(date, doctorId, clinicId, status); }

  @Post('appointments/:id/checkin')
  @ApiOperation({ summary: 'Check-in booking → buat kunjungan otomatis' })
  checkIn(@Param('id') id: string, @CurrentUser('id') uid: string) {
    return this.svc.checkInAppointment(id, uid);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Visit, Appointment])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
