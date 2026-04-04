import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IsUUID, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser, Roles } from '../../common/decorators';

// ================================================================
// BILLING MODULE
// ================================================================

export class GenerateInvoiceDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class AddPaymentDto {
  @ApiProperty() @IsUUID() invoiceId: string;
  @ApiProperty({ enum: ['cash','transfer','debit','credit','qris','bpjs','insurance','corporate'] })
  paymentMethod: string;
  @ApiProperty() @IsNumber() amount: number;
  @ApiPropertyOptional() @IsOptional() referenceNo?: string;
  @ApiPropertyOptional() @IsOptional() bankName?: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

@Injectable()
export class BillingService {
  constructor(private ds: DataSource) {}

  async generateInvoice(dto: GenerateInvoiceDto, userId: string) {
    const [visit] = await this.ds.query(
      `SELECT v.*, p.full_name AS patient_name, ps.scheme_type
       FROM visits v JOIN patients p ON p.id=v.patient_id
       JOIN payment_schemes ps ON ps.id=v.payment_scheme_id
       WHERE v.id=$1`, [dto.visitId],
    );
    if (!visit) throw new NotFoundException('Kunjungan tidak ditemukan');

    // Kumpulkan semua item billable
    const services = await this.ds.query(
      `SELECT vp.id, 'service' AS item_type, 'visit_procedures' AS ref_type,
              vp.id AS ref_id, s.id AS service_id, s.name AS description,
              vp.quantity,
              COALESCE(st.base_price, 0) AS unit_price
       FROM visit_procedures vp
       JOIN services s ON s.id=vp.service_id AND vp.is_billable=true
       LEFT JOIN service_tariffs st ON st.service_id=s.id
         AND st.payment_scheme_id=$2 AND st.is_active=true
       WHERE vp.visit_id=$1`, [dto.visitId, visit.payment_scheme_id],
    );
    const drugs = await this.ds.query(
      `SELECT di.id, 'drug' AS item_type, 'dispensing_items' AS ref_type,
              di.id AS ref_id, NULL AS service_id,
              CONCAT(di.drug_id::text, ' - ', pi.drug_name) AS description,
              di.quantity, di.unit_price
       FROM dispensings d
       JOIN prescription_items pi ON pi.prescription_id=d.prescription_id
       JOIN dispensing_items di ON di.dispensing_id=d.id AND di.drug_id=pi.drug_id
       WHERE d.prescription_id IN (
         SELECT id FROM prescriptions WHERE visit_id=$1
       )`, [dto.visitId],
    );
    const rooms = await this.ds.query(
      `SELECT 'room' AS item_type, 'admissions' AS ref_type,
              a.id AS ref_id, s.id AS service_id, s.name AS description,
              COALESCE(a.actual_los_days, 1) AS quantity,
              COALESCE(st.base_price, 0) AS unit_price
       FROM admissions a
       JOIN services s ON s.service_type='inpatient' AND s.installation_id=(
         SELECT installation_id FROM clinics WHERE id=(SELECT clinic_id FROM visits WHERE id=$1)
       )
       LEFT JOIN service_tariffs st ON st.service_id=s.id
         AND st.payment_scheme_id=$2 AND st.is_active=true
       WHERE a.visit_id=$1`, [dto.visitId, visit.payment_scheme_id],
    );

    const allItems = [...services, ...drugs, ...rooms];
    const subtotal = allItems.reduce((s, i) => s + (+i.quantity * +i.unit_price), 0);
    const coveredPct = visit.scheme_type === 'bpjs' ? 100 : 0;
    const covered = (subtotal * coveredPct) / 100;
    const patientPortion = subtotal - covered;

    const d = new Date();
    const prefix = `INV-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM invoices WHERE invoice_no LIKE '${prefix}%'`);
    const invNo = prefix + String(cnt.n).padStart(4,'0');

    const [inv] = await this.ds.query(
      `INSERT INTO invoices
         (invoice_no, visit_id, patient_id, payment_scheme_id, invoice_date,
          invoice_type, status, subtotal, total_amount, covered_amount, patient_portion, created_by)
       VALUES ($1,$2,$3,$4,CURRENT_DATE,'final','issued',$5,$6,$7,$8,$9) RETURNING id`,
      [invNo, dto.visitId, visit.patient_id, visit.payment_scheme_id,
       subtotal, subtotal, covered, patientPortion, userId],
    );

    for (let i = 0; i < allItems.length; i++) {
      const item = allItems[i];
      const net = +item.quantity * +item.unit_price;
      await this.ds.query(
        `INSERT INTO invoice_items
           (invoice_id, item_type, reference_id, reference_type, service_id,
            description, quantity, unit_price, net_amount,
            covered_pct, covered_amount, patient_amount, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [inv.id, item.item_type, item.ref_id, item.ref_type, item.service_id,
         item.description, item.quantity, item.unit_price, net,
         coveredPct, (net*coveredPct)/100, net-(net*coveredPct)/100, i],
      );
    }
    return { invoiceId: inv.id, invoiceNo: invNo, total: subtotal, message: 'Invoice berhasil dibuat' };
  }

  async getInvoice(id: string) {
    const [inv] = await this.ds.query(
      `SELECT i.*, p.full_name AS patient_name, p.medical_record_no,
              p.bpjs_number, ps.name AS scheme_name, ps.scheme_type,
              py.name AS payer_name, v.visit_number, v.visit_type
       FROM invoices i
       JOIN patients p ON p.id=i.patient_id
       JOIN payment_schemes ps ON ps.id=i.payment_scheme_id
       LEFT JOIN payers py ON py.id=ps.payer_id
       JOIN visits v ON v.id=i.visit_id
       WHERE i.id=$1`, [id],
    );
    if (!inv) throw new NotFoundException('Invoice tidak ditemukan');
    const items = await this.ds.query(
      `SELECT ii.* FROM invoice_items ii WHERE ii.invoice_id=$1 ORDER BY ii.sort_order`, [id],
    );
    return { ...inv, items };
  }

  async getInvoices(status?: string, patientId?: string, startDate?: string, endDate?: string, page = 1, limit = 20) {
    const offset = (page-1)*limit;
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (status)    { p.push(status);    where += ` AND i.status=$${p.length}`; }
    if (patientId) { p.push(patientId); where += ` AND i.patient_id=$${p.length}`; }
    if (startDate) { p.push(startDate); where += ` AND i.invoice_date>=$${p.length}`; }
    if (endDate)   { p.push(endDate);   where += ` AND i.invoice_date<=$${p.length}`; }
    p.push(limit); p.push(offset);
    return this.ds.query(
      `SELECT i.id, i.invoice_no, i.invoice_date, i.status, i.total_amount,
              i.covered_amount, i.patient_portion, i.paid_amount, i.outstanding_amount,
              p.full_name AS patient_name, p.medical_record_no,
              ps.name AS scheme_name
       FROM invoices i JOIN patients p ON p.id=i.patient_id
       JOIN payment_schemes ps ON ps.id=i.payment_scheme_id
       ${where} ORDER BY i.invoice_date DESC
       LIMIT $${p.length-1} OFFSET $${p.length}`, p,
    );
  }

  async addPayment(dto: AddPaymentDto, userId: string) {
    const [inv] = await this.ds.query(
      `SELECT id, patient_portion, paid_amount, outstanding_amount FROM invoices WHERE id=$1`, [dto.invoiceId],
    );
    if (!inv) throw new NotFoundException('Invoice tidak ditemukan');
    if (+inv.outstanding_amount <= 0) throw new BadRequestException('Invoice sudah lunas');

    const d = new Date();
    const prefix = `PAY-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM payments WHERE payment_no LIKE '${prefix}%'`);
    const payNo = prefix + String(cnt.n).padStart(4,'0');

    await this.ds.query(
      `INSERT INTO payments (payment_no, invoice_id, payment_method, amount, reference_no, bank_name, cashier_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [payNo, dto.invoiceId, dto.paymentMethod, dto.amount,
       dto.referenceNo, dto.bankName, userId, dto.notes],
    );

    const newPaid  = +inv.paid_amount + dto.amount;
    const newOutstanding = +inv.patient_portion - newPaid;
    const newStatus = newOutstanding <= 0 ? 'paid' : 'partial';
    await this.ds.query(
      `UPDATE invoices SET paid_amount=$1, outstanding_amount=$2, status=$3 WHERE id=$4`,
      [newPaid, Math.max(0, newOutstanding), newStatus, dto.invoiceId],
    );
    return { paymentNo: payNo, message: 'Pembayaran berhasil dicatat', remaining: Math.max(0, newOutstanding) };
  }

  async voidPayment(payId: string, reason: string, userId: string) {
    const [pay] = await this.ds.query(`SELECT * FROM payments WHERE id=$1`, [payId]);
    if (!pay) throw new NotFoundException();
    if (pay.is_voided) throw new BadRequestException('Pembayaran sudah di-void');
    await this.ds.query(
      `UPDATE payments SET is_voided=true, voided_by=$1, voided_at=NOW(), void_reason=$2 WHERE id=$3`,
      [userId, reason, payId],
    );
    await this.ds.query(
      `UPDATE invoices SET paid_amount=paid_amount-$1,
         outstanding_amount=outstanding_amount+$1,
         status=CASE WHEN paid_amount-$1<=0 THEN 'issued' ELSE 'partial' END
       WHERE id=$2`, [pay.amount, pay.invoice_id],
    );
    return { message: 'Pembayaran berhasil di-void' };
  }

  async getOutstanding(payerId?: string, aging?: string) {
    let where = `WHERE i.outstanding_amount > 0 AND i.status NOT IN ('cancelled')`;
    const p: any[] = [];
    if (payerId) { p.push(payerId); where += ` AND ps.payer_id=$${p.length}`; }
    if (aging)   where += ` AND ar.aging_bucket='${aging}'`;
    return this.ds.query(
      `SELECT i.invoice_no, i.invoice_date, i.due_date, i.status,
              i.total_amount, i.covered_amount, i.patient_portion,
              i.paid_amount, i.outstanding_amount,
              p.full_name AS patient_name, p.medical_record_no,
              ps.name AS scheme_name, py.name AS payer_name,
              ar.aging_bucket, ar.aging_days
       FROM invoices i
       JOIN patients p ON p.id=i.patient_id
       JOIN payment_schemes ps ON ps.id=i.payment_scheme_id
       LEFT JOIN payers py ON py.id=ps.payer_id
       LEFT JOIN ar_aging ar ON ar.invoice_id=i.id
       ${where} ORDER BY i.invoice_date`, p,
    );
  }
}

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly svc: BillingService) {}

  @Post('invoices') @ApiOperation({ summary: 'Generate invoice dari kunjungan' })
  generate(@Body() dto: GenerateInvoiceDto, @CurrentUser('id') uid: string) { return this.svc.generateInvoice(dto, uid); }
  @Get('invoices') @ApiOperation({ summary: 'Daftar invoice' })
  list(@Query('status') s?: string, @Query('patientId') p?: string,
    @Query('startDate') sd?: string, @Query('endDate') ed?: string,
    @Query('page') pg = 1, @Query('limit') lm = 20) {
    return this.svc.getInvoices(s, p, sd, ed, +pg, +lm);
  }
  @Get('invoices/outstanding') @ApiOperation({ summary: 'Tagihan belum lunas (AR)' })
  outstanding(@Query('payerId') p?: string, @Query('aging') a?: string) { return this.svc.getOutstanding(p, a); }
  @Get('invoices/:id') @ApiOperation({ summary: 'Detail invoice' })
  detail(@Param('id') id: string) { return this.svc.getInvoice(id); }

  @Post('payments') @ApiOperation({ summary: 'Catat pembayaran' })
  pay(@Body() dto: AddPaymentDto, @CurrentUser('id') uid: string) { return this.svc.addPayment(dto, uid); }
  @Patch('payments/:id/void') @ApiOperation({ summary: 'Void pembayaran' })
  void(@Param('id') id: string, @Body('reason') r: string, @CurrentUser('id') uid: string) {
    return this.svc.voidPayment(id, r, uid);
  }
}

// ================================================================
// BPJS MODULE
// ================================================================

@Injectable()
export class BpjsService {
  constructor(private ds: DataSource) {}

  async createSEP(body: any, userId: string) {
    const [visit] = await this.ds.query(
      `SELECT v.*, p.bpjs_number FROM visits v JOIN patients p ON p.id=v.patient_id WHERE v.id=$1`, [body.visitId],
    );
    if (!visit) throw new NotFoundException('Kunjungan tidak ditemukan');
    if (!visit.bpjs_number) throw new BadRequestException('Pasien tidak memiliki nomor BPJS');

    const d = new Date();
    const prefix = `SEP${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM bpjs_seps WHERE sep_no LIKE '${prefix}%'`);
    const sepNo = prefix + String(cnt.n).padStart(6,'0');

    const [sep] = await this.ds.query(
      `INSERT INTO bpjs_seps
         (sep_no, visit_id, patient_id, bpjs_no, sep_date, care_type,
          poli_tujuan, diagnosa_awal, icd10_code, rujukan_no, rujukan_from)
       VALUES ($1,$2,$3,$4,CURRENT_DATE,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [sepNo, body.visitId, visit.patient_id, visit.bpjs_number,
       body.careType||'1', body.poliTujuan, body.diagnosaAwal,
       body.icd10Code, body.rujukanNo, body.rujukanFrom],
    );
    return { ...sep, message: 'SEP berhasil dibuat' };
  }

  async getSEPs(startDate?: string, endDate?: string, status?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (startDate) { p.push(startDate); where += ` AND s.sep_date>=$${p.length}`; }
    if (endDate)   { p.push(endDate);   where += ` AND s.sep_date<=$${p.length}`; }
    return this.ds.query(
      `SELECT s.sep_no, s.sep_date, s.care_type, s.poli_tujuan,
              s.diagnosa_awal, s.icd10_code, s.rujukan_no,
              p.full_name AS patient_name, p.bpjs_number,
              v.visit_number,
              c.name AS clinic_name
       FROM bpjs_seps s
       JOIN patients p ON p.id=s.patient_id
       JOIN visits v ON v.id=s.visit_id
       JOIN clinics c ON c.id=v.clinic_id
       ${where} ORDER BY s.sep_date DESC`, p,
    );
  }

  async checkEligibility(bpjsNo: string) {
    // Placeholder — panggil VClaim API di production
    const [patient] = await this.ds.query(
      `SELECT id, full_name, bpjs_number, date_of_birth
       FROM patients WHERE bpjs_number=$1`, [bpjsNo],
    );
    return {
      bpjsNo,
      patient: patient || null,
      eligible: !!patient,
      message: patient ? 'Peserta aktif' : 'Nomor BPJS tidak ditemukan di database lokal',
      note: 'Untuk validasi real-time, integrasikan dengan VClaim BPJS API',
    };
  }

  async getSEPSummary(month: number, year: number) {
    return this.ds.query(
      `SELECT care_type,
              COUNT(*) AS total,
              COUNT(*) FILTER (WHERE care_type='1') AS rawat_jalan,
              COUNT(*) FILTER (WHERE care_type='2') AS rawat_inap
       FROM bpjs_seps
       WHERE EXTRACT(MONTH FROM sep_date)=$1 AND EXTRACT(YEAR FROM sep_date)=$2
       GROUP BY care_type`, [month, year],
    );
  }
}

@ApiTags('BPJS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bpjs')
export class BpjsController {
  constructor(private readonly svc: BpjsService) {}

  @Post('sep') @ApiOperation({ summary: 'Buat SEP BPJS' })
  createSEP(@Body() body: any, @CurrentUser('id') uid: string) { return this.svc.createSEP(body, uid); }
  @Get('sep') @ApiOperation({ summary: 'Daftar SEP' })
  getSEPs(@Query('startDate') s?: string, @Query('endDate') e?: string) { return this.svc.getSEPs(s, e); }
  @Get('sep/summary') @ApiOperation({ summary: 'Ringkasan SEP per bulan' })
  summary(@Query('month') m: number, @Query('year') y: number) { return this.svc.getSEPSummary(+m, +y); }
  @Get('eligibility/:bpjsNo') @ApiOperation({ summary: 'Cek eligibilitas peserta BPJS' })
  check(@Param('bpjsNo') no: string) { return this.svc.checkEligibility(no); }
}

// ================================================================
// MASTER DATA MODULE
// ================================================================

@Injectable()
export class MasterService {
  constructor(private ds: DataSource) {}

  async getDoctors(search?: string, specializationCode?: string, clinicId?: string) {
    let where = 'WHERE d.is_active=true AND e.is_active=true';
    const p: any[] = [];
    if (search) { p.push(`%${search}%`); where += ` AND e.full_name ILIKE $${p.length}`; }
    if (specializationCode) { p.push(specializationCode); where += ` AND sp.code=$${p.length}`; }
    if (clinicId) { p.push(clinicId); where += ` AND EXISTS (SELECT 1 FROM doctor_schedules ds2 WHERE ds2.doctor_id=d.id AND ds2.clinic_id=$${p.length} AND ds2.is_active=true)`; }
    return this.ds.query(
      `SELECT d.id, e.full_name, d.title_prefix, d.title_suffix, d.sip_expires_at,
              CONCAT(d.title_prefix,' ',e.full_name,', ',d.title_suffix) AS full_title,
              ARRAY_AGG(DISTINCT sp.name) AS specializations,
              ARRAY_AGG(DISTINCT c.name) AS clinics
       FROM doctors d
       JOIN employees e ON e.id=d.employee_id
       LEFT JOIN doctor_specializations ds ON ds.doctor_id=d.id
       LEFT JOIN specializations sp ON sp.id=ds.specialization_id
       LEFT JOIN doctor_schedules dsch ON dsch.doctor_id=d.id AND dsch.is_active=true
       LEFT JOIN clinics c ON c.id=dsch.clinic_id
       ${where}
       GROUP BY d.id, e.full_name, d.title_prefix, d.title_suffix, d.sip_expires_at
       ORDER BY e.full_name`, p,
    );
  }

  async getDoctorSchedules(doctorId?: string, clinicId?: string, dayOfWeek?: number) {
    let where = 'WHERE ds.is_active=true';
    const p: any[] = [];
    if (doctorId)  { p.push(doctorId);  where += ` AND ds.doctor_id=$${p.length}`; }
    if (clinicId)  { p.push(clinicId);  where += ` AND ds.clinic_id=$${p.length}`; }
    if (dayOfWeek !== undefined) { p.push(dayOfWeek); where += ` AND ds.day_of_week=$${p.length}`; }
    return this.ds.query(
      `SELECT ds.*, CONCAT(d.title_prefix,' ',e.full_name,', ',d.title_suffix) AS doctor_name,
              c.name AS clinic_name, c.code AS clinic_code,
              CASE ds.day_of_week
                WHEN 0 THEN 'Minggu' WHEN 1 THEN 'Senin' WHEN 2 THEN 'Selasa'
                WHEN 3 THEN 'Rabu' WHEN 4 THEN 'Kamis' WHEN 5 THEN 'Jumat' WHEN 6 THEN 'Sabtu'
              END AS day_name
       FROM doctor_schedules ds
       JOIN doctors d ON d.id=ds.doctor_id
       JOIN employees e ON e.id=d.employee_id
       JOIN clinics c ON c.id=ds.clinic_id
       ${where} ORDER BY ds.day_of_week, ds.time_start`, p,
    );
  }

  async getClinics(installationCode?: string, type?: string, bpjsOnly = false) {
    let where = 'WHERE c.is_active=true';
    const p: any[] = [];
    if (installationCode) { p.push(installationCode); where += ` AND inst.code=$${p.length}`; }
    if (type)             { p.push(type);             where += ` AND c.clinic_type=$${p.length}`; }
    if (bpjsOnly)         where += ` AND c.is_bpjs_active=true`;
    return this.ds.query(
      `SELECT c.id, c.code, c.name, c.clinic_type, c.queue_prefix,
              c.max_daily_quota, c.is_bpjs_active,
              d.name AS department_name, inst.name AS installation_name,
              inst.code AS installation_code
       FROM clinics c
       JOIN departments d ON d.id=c.department_id
       JOIN installations inst ON inst.id=d.installation_id
       ${where} ORDER BY inst.code, c.code`, p,
    );
  }

  async getServices(categoryCode?: string, installationCode?: string, search?: string, isBpjs?: boolean) {
    let where = 'WHERE s.is_active=true';
    const p: any[] = [];
    if (search)           { p.push(`%${search}%`); where += ` AND s.name ILIKE $${p.length}`; }
    if (categoryCode)     { p.push(categoryCode);  where += ` AND sc.code=$${p.length}`; }
    if (installationCode) { p.push(installationCode); where += ` AND inst.code=$${p.length}`; }
    if (isBpjs !== undefined) where += ` AND s.is_bpjs_covered=${isBpjs}`;
    return this.ds.query(
      `SELECT s.id, s.code, s.name, s.service_type, s.unit_of_measure,
              s.duration_minutes, s.requires_doctor, s.is_bpjs_covered,
              sc.name AS category_name, inst.name AS installation_name
       FROM services s
       JOIN service_categories sc ON sc.id=s.category_id
       JOIN installations inst ON inst.id=s.installation_id
       ${where} ORDER BY sc.code, s.name
       LIMIT 200`, p,
    );
  }

  async getPaymentSchemes(type?: string) {
    let where = 'WHERE ps.is_active=true';
    const p: any[] = [];
    if (type) { p.push(type); where += ` AND ps.scheme_type=$${p.length}`; }
    return this.ds.query(
      `SELECT ps.id, ps.code, ps.name, ps.scheme_type, ps.tariff_class,
              ps.coverage_pct, ps.max_coverage, ps.requires_rujukan,
              py.name AS payer_name, py.payer_type
       FROM payment_schemes ps LEFT JOIN payers py ON py.id=ps.payer_id
       ${where} ORDER BY ps.scheme_type, ps.name`, p,
    );
  }

  async getServiceTariffs(serviceId: string, schemeCode?: string) {
    let where = `WHERE st.service_id=$1 AND st.is_active=true AND st.effective_date<=CURRENT_DATE
                   AND (st.expired_date IS NULL OR st.expired_date>=CURRENT_DATE)`;
    const p: any[] = [serviceId];
    if (schemeCode) { p.push(schemeCode); where += ` AND ps.code=$${p.length}`; }
    return this.ds.query(
      `SELECT st.id, ps.code AS scheme_code, ps.name AS scheme_name,
              ps.scheme_type, st.room_class, st.tariff_class,
              st.base_price, st.doctor_fee, st.hospital_fee,
              st.tax_rate, st.effective_date
       FROM service_tariffs st JOIN payment_schemes ps ON ps.id=st.payment_scheme_id
       ${where} ORDER BY ps.scheme_type, st.room_class`, p,
    );
  }

  async getRegions(level?: string, parentCode?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (level)      { p.push(level);      where += ` AND r.level=$${p.length}`; }
    if (parentCode) { p.push(parentCode); where += ` AND p.code=$${p.length}`; }
    return this.ds.query(
      `SELECT r.id, r.code, r.name, r.level, p.name AS parent_name
       FROM regions r LEFT JOIN regions p ON p.id=r.parent_id
       ${where} ORDER BY r.level, r.name LIMIT 500`, p,
    );
  }

  async getSystemConfigs(group?: string) {
    let where = 'WHERE is_editable=true';
    const p: any[] = [];
    if (group) { p.push(group); where += ` AND group_name=$${p.length}`; }
    return this.ds.query(`SELECT key, value, value_type, group_name, description FROM system_configs ${where} ORDER BY group_name, key`, p);
  }

  async updateSystemConfig(key: string, value: string, userId: string) {
    await this.ds.query(
      `UPDATE system_configs SET value=$1, updated_by=$2, updated_at=NOW()
       WHERE key=$3 AND is_editable=true`, [value, userId, key],
    );
    return { message: 'Konfigurasi diperbarui' };
  }
}

@ApiTags('Master Data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master')
export class MasterController {
  constructor(private readonly svc: MasterService) {}

  @Get('doctors') @ApiOperation({ summary: 'Daftar dokter' })
  doctors(@Query('search') s?: string, @Query('specializationCode') sp?: string, @Query('clinicId') c?: string) {
    return this.svc.getDoctors(s, sp, c);
  }
  @Get('doctor-schedules') @ApiOperation({ summary: 'Jadwal dokter' })
  schedules(@Query('doctorId') d?: string, @Query('clinicId') c?: string, @Query('dayOfWeek') day?: number) {
    return this.svc.getDoctorSchedules(d, c, day !== undefined ? +day : undefined);
  }
  @Get('clinics') @ApiOperation({ summary: 'Daftar poli/klinik' })
  clinics(@Query('installation') inst?: string, @Query('type') t?: string, @Query('bpjsOnly') bpjs?: string) {
    return this.svc.getClinics(inst, t, bpjs === 'true');
  }
  @Get('services') @ApiOperation({ summary: 'Katalog layanan' })
  services(@Query('category') cat?: string, @Query('installation') inst?: string,
    @Query('search') s?: string, @Query('bpjs') bpjs?: string) {
    return this.svc.getServices(cat, inst, s, bpjs !== undefined ? bpjs === 'true' : undefined);
  }
  @Get('services/:id/tariffs') @ApiOperation({ summary: 'Tarif layanan per skema' })
  tariffs(@Param('id') id: string, @Query('scheme') scheme?: string) { return this.svc.getServiceTariffs(id, scheme); }
  @Get('payment-schemes') @ApiOperation({ summary: 'Skema pembayaran' })
  schemes(@Query('type') t?: string) { return this.svc.getPaymentSchemes(t); }
  @Get('regions') @ApiOperation({ summary: 'Wilayah (provinsi/kab/kec/kel)' })
  regions(@Query('level') l?: string, @Query('parentCode') p?: string) { return this.svc.getRegions(l, p); }
  @Get('configs') @ApiOperation({ summary: 'Konfigurasi sistem' })
  configs(@Query('group') g?: string) { return this.svc.getSystemConfigs(g); }
  @Patch('configs/:key') @ApiOperation({ summary: 'Update konfigurasi sistem' })
  @Roles('SUPERADMIN','ADMIN_RS')
  updateConfig(@Param('key') k: string, @Body('value') v: string, @CurrentUser('id') uid: string) {
    return this.svc.updateSystemConfig(k, v, uid);
  }
}

// ================================================================
// REPORTS MODULE
// ================================================================

@Injectable()
export class ReportsService {
  constructor(private ds: DataSource) {}

  async visitStats(startDate: string, endDate: string, groupBy: 'day'|'week'|'month' = 'day') {
    const trunc = groupBy === 'month' ? 'month' : groupBy === 'week' ? 'week' : 'day';
    return this.ds.query(
      `SELECT DATE_TRUNC($1, visit_date) AS period,
              visit_type, COUNT(*) AS total,
              COUNT(*) FILTER (WHERE visit_status='done') AS completed,
              COUNT(*) FILTER (WHERE visit_status='cancelled') AS cancelled
       FROM visits
       WHERE visit_date BETWEEN $2 AND $3
       GROUP BY DATE_TRUNC($1, visit_date), visit_type
       ORDER BY period`, [trunc, startDate, endDate],
    );
  }

  async revenueReport(startDate: string, endDate: string) {
    return this.ds.query(
      `SELECT ps.scheme_type, ps.name AS scheme_name,
              COUNT(i.id) AS invoice_count,
              SUM(i.total_amount) AS gross_revenue,
              SUM(i.covered_amount) AS covered,
              SUM(i.patient_portion) AS patient_portion,
              SUM(i.paid_amount) AS collected,
              SUM(i.outstanding_amount) AS outstanding
       FROM invoices i JOIN payment_schemes ps ON ps.id=i.payment_scheme_id
       WHERE i.invoice_date BETWEEN $1 AND $2
         AND i.status NOT IN ('cancelled')
       GROUP BY ps.scheme_type, ps.name
       ORDER BY ps.scheme_type`, [startDate, endDate],
    );
  }

  async bpjsReport(month: number, year: number) {
    return this.ds.query(
      `SELECT c.name AS poli, COUNT(s.id) AS total_sep,
              COUNT(s.id) FILTER (WHERE s.care_type='1') AS rawat_jalan,
              COUNT(s.id) FILTER (WHERE s.care_type='2') AS rawat_inap
       FROM bpjs_seps s
       JOIN visits v ON v.id=s.visit_id
       JOIN clinics c ON c.id=v.clinic_id
       WHERE EXTRACT(MONTH FROM s.sep_date)=$1 AND EXTRACT(YEAR FROM s.sep_date)=$2
       GROUP BY c.name ORDER BY total_sep DESC`, [month, year],
    );
  }

  async bedOccupancy(startDate: string, endDate: string) {
    return this.ds.query(
      `SELECT b.bed_class, r.building,
              COUNT(DISTINCT b.id) AS total_beds,
              COUNT(DISTINCT a.id) AS admissions,
              AVG(a.actual_los_days) AS avg_los,
              ROUND(COUNT(DISTINCT a.id)::numeric / COUNT(DISTINCT b.id) * 100, 2) AS occupancy_pct
       FROM beds b
       JOIN rooms r ON r.id=b.room_id
       LEFT JOIN admissions a ON a.bed_id=b.id
         AND a.admission_date BETWEEN $1 AND $2
       GROUP BY b.bed_class, r.building ORDER BY b.bed_class`, [startDate, endDate],
    );
  }

  async drugUsage(startDate: string, endDate: string, warehouseId?: string) {
    let where = `WHERE di.created_at BETWEEN $1 AND $2`;
    const p: any[] = [startDate, endDate];
    if (warehouseId) { p.push(warehouseId); where += ` AND d.warehouse_id=$${p.length}`; }
    return this.ds.query(
      `SELECT dr.code, dr.generic_name, dr.drug_form, dr.strength,
              SUM(di.quantity) AS total_dispensed, di.unit,
              SUM(di.quantity * di.unit_price) AS total_value
       FROM dispensing_items di
       JOIN dispensings d ON d.id=di.dispensing_id
       JOIN drugs dr ON dr.id=di.drug_id
       ${where}
       GROUP BY dr.code, dr.generic_name, dr.drug_form, dr.strength, di.unit
       ORDER BY total_dispensed DESC LIMIT 50`, p,
    );
  }

  async dashboardSummary() {
    const [today, beds, revenue, pending] = await Promise.all([
      this.ds.query(
        `SELECT
           COUNT(*) AS total_visits,
           COUNT(*) FILTER (WHERE visit_type='outpatient') AS outpatient,
           COUNT(*) FILTER (WHERE visit_type='inpatient') AS inpatient,
           COUNT(*) FILTER (WHERE visit_type='igd') AS igd,
           COUNT(*) FILTER (WHERE visit_status='waiting' OR visit_status='in_progress') AS active
         FROM visits WHERE visit_date=CURRENT_DATE`,
      ),
      this.ds.query(
        `SELECT status, COUNT(*) AS count FROM bed_status GROUP BY status`,
      ),
      this.ds.query(
        `SELECT COALESCE(SUM(paid_amount),0) AS today_revenue
         FROM payments WHERE DATE(payment_date)=CURRENT_DATE AND NOT is_voided`,
      ),
      this.ds.query(
        `SELECT COUNT(*) AS pending_rx FROM prescriptions WHERE status='pending'`,
      ),
    ]);
    return {
      today: today[0],
      beds: beds.reduce((o: any, r: any) => ({ ...o, [r.status]: +r.count }), {}),
      todayRevenue: +revenue[0].today_revenue,
      pendingRx: +pending[0].pending_rx,
    };
  }
}

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly svc: ReportsService) {}

  @Get('dashboard') @ApiOperation({ summary: 'Ringkasan dashboard utama' })
  dashboard() { return this.svc.dashboardSummary(); }
  @Get('visits') @ApiOperation({ summary: 'Statistik kunjungan' })
  visits(@Query('startDate') s: string, @Query('endDate') e: string, @Query('groupBy') g: any = 'day') {
    return this.svc.visitStats(s, e, g);
  }
  @Get('revenue') @ApiOperation({ summary: 'Laporan pendapatan per skema' })
  revenue(@Query('startDate') s: string, @Query('endDate') e: string) { return this.svc.revenueReport(s, e); }
  @Get('bpjs') @ApiOperation({ summary: 'Laporan BPJS per bulan' })
  bpjs(@Query('month') m: number, @Query('year') y: number) { return this.svc.bpjsReport(+m, +y); }
  @Get('bed-occupancy') @ApiOperation({ summary: 'Occupancy tempat tidur' })
  beds(@Query('startDate') s: string, @Query('endDate') e: string) { return this.svc.bedOccupancy(s, e); }
  @Get('drug-usage') @ApiOperation({ summary: 'Penggunaan obat' })
  drugs(@Query('startDate') s: string, @Query('endDate') e: string, @Query('warehouseId') w?: string) {
    return this.svc.drugUsage(s, e, w);
  }
}

// ================================================================
// COMBINED MODULE
// ================================================================
@Module({
  controllers: [BillingController, BpjsController, MasterController, ReportsController],
  providers: [BillingService, BpjsService, MasterService, ReportsService],
  exports: [BillingService, MasterService],
})
export class CoreModules {}
