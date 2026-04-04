import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators';

// ── DTOs ──────────────────────────────────────────────────────────
export class CreateSoapDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiPropertyOptional({ enum: ['soap','cppt','nursing','anesthesia','discharge'] })
  @IsOptional() noteType?: string;
  @ApiPropertyOptional() @IsOptional() subjective?: string;
  @ApiPropertyOptional() @IsOptional() objective?: string;
  @ApiPropertyOptional() @IsOptional() assessment?: string;
  @ApiPropertyOptional() @IsOptional() plan?: string;
  @ApiPropertyOptional() @IsOptional() noteContent?: string;
}

export class AddDiagnosisDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiProperty() @IsUUID() icd10Id: string;
  @ApiPropertyOptional({ enum: ['primary','secondary','complication'] })
  @IsOptional() diagnosisType?: string;
  @ApiPropertyOptional() @IsOptional() isConfirmed?: boolean;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class CreateLabOrderDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiPropertyOptional({ enum: ['routine','urgent','cito'] })
  @IsOptional() priority?: string;
  @ApiPropertyOptional() @IsOptional() clinicalInfo?: string;
  @ApiProperty({ type: [String], description: 'Array service_id' })
  @IsArray() @IsUUID('all', { each: true }) serviceIds: string[];
}

export class LabResultDto {
  @ApiProperty() @IsUUID() itemId: string;
  @ApiProperty() @IsString() @IsNotEmpty() resultValue: string;
  @ApiPropertyOptional() @IsOptional() resultUnit?: string;
  @ApiPropertyOptional() @IsOptional() normalRange?: string;
  @ApiPropertyOptional({ enum: ['normal','low','high','critical'] })
  @IsOptional() resultFlag?: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class CreateRadOrderDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiProperty() @IsUUID() serviceId: string;
  @ApiPropertyOptional({ enum: ['routine','urgent','cito'] })
  @IsOptional() priority?: string;
  @ApiPropertyOptional() @IsOptional() clinicalInfo?: string;
}

export class CreatePrescriptionDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiPropertyOptional({ enum: ['regular','chronic','narcotic','emergency'] })
  @IsOptional() prescriptionType?: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
  @ApiProperty({ type: [Object] }) items: PrescriptionItemDto[];
}

export class PrescriptionItemDto {
  @ApiProperty() @IsUUID() drugId: string;
  @ApiProperty() quantity: number;
  @ApiProperty() @IsString() unit: string;
  @ApiProperty() @IsString() dosageInstruction: string;
  @ApiPropertyOptional() durationDays?: number;
  @ApiPropertyOptional() route?: string;
  @ApiPropertyOptional() isGeneric?: boolean;
}

export class CreateProcedureDto {
  @ApiProperty() @IsUUID() visitId: string;
  @ApiProperty() @IsUUID() serviceId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() icd9Id?: string;
  @ApiPropertyOptional() quantity?: number;
  @ApiPropertyOptional() notes?: string;
}

// ── Service ───────────────────────────────────────────────────────
@Injectable()
export class EmrService {
  constructor(private ds: DataSource) {}

  // ── SOAP / Notes ──────────────────────────────────────────────
  async createNote(dto: CreateSoapDto, userId: string) {
    const [v] = await this.ds.query(`SELECT id FROM visits WHERE id=$1`, [dto.visitId]);
    if (!v) throw new NotFoundException('Kunjungan tidak ditemukan');

    const [note] = await this.ds.query(
      `INSERT INTO medical_notes
         (visit_id, note_type, subjective, objective, assessment, plan, note_content, written_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [dto.visitId, dto.noteType||'soap', dto.subjective, dto.objective,
       dto.assessment, dto.plan, dto.noteContent, userId],
    );
    return note;
  }

  async getNotes(visitId: string) {
    return this.ds.query(
      `SELECT mn.*, u.full_name AS written_by_name
       FROM medical_notes mn
       JOIN users u ON u.id = mn.written_by
       WHERE mn.visit_id=$1 ORDER BY mn.written_at`, [visitId],
    );
  }

  async lockNote(noteId: string) {
    await this.ds.query(`UPDATE medical_notes SET is_locked=true WHERE id=$1`, [noteId]);
    return { message: 'Catatan dikunci' };
  }

  // ── Diagnosa ──────────────────────────────────────────────────
  async addDiagnosis(dto: AddDiagnosisDto, userId: string) {
    const [row] = await this.ds.query(
      `INSERT INTO visit_diagnoses (visit_id, icd10_id, diagnosis_type, is_confirmed, noted_by, notes)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING RETURNING *`,
      [dto.visitId, dto.icd10Id, dto.diagnosisType||'primary',
       dto.isConfirmed??true, userId, dto.notes],
    );
    return row;
  }

  async getDiagnoses(visitId: string) {
    return this.ds.query(
      `SELECT vd.*, i.code AS icd10_code, i.name_id AS diagnosis_name
       FROM visit_diagnoses vd
       JOIN icd10_diagnoses i ON i.id = vd.icd10_id
       WHERE vd.visit_id=$1 ORDER BY vd.noted_at`, [visitId],
    );
  }

  async removeDiagnosis(diagId: string) {
    await this.ds.query(`DELETE FROM visit_diagnoses WHERE id=$1`, [diagId]);
    return { message: 'Diagnosa dihapus' };
  }

  // ── Lab Order ─────────────────────────────────────────────────
  async createLabOrder(dto: CreateLabOrderDto, userId: string) {
    const d = new Date();
    const prefix = `LAB-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM lab_orders WHERE order_no LIKE '${prefix}%'`);
    const orderNo = prefix + String(cnt.n).padStart(3,'0');

    const [order] = await this.ds.query(
      `INSERT INTO lab_orders (order_no, visit_id, ordered_by, priority, clinical_info, status)
       SELECT $1, $2, doc.id, $3, $4, 'ordered'
       FROM visits v JOIN doctors doc ON doc.employee_id = (
         SELECT employee_id FROM users WHERE id = $5
       ) WHERE v.id = $2 RETURNING *`,
      [orderNo, dto.visitId, dto.priority||'routine', dto.clinicalInfo, userId],
    );

    // Fallback jika user bukan dokter — pakai doctor_id dari visit
    let orderId = order?.id;
    if (!orderId) {
      const [o] = await this.ds.query(
        `INSERT INTO lab_orders (order_no, visit_id, ordered_by, priority, clinical_info, status)
         VALUES ($1,$2,(SELECT doctor_id FROM visits WHERE id=$2),$3,$4,'ordered') RETURNING id`,
        [orderNo, dto.visitId, dto.priority||'routine', dto.clinicalInfo],
      );
      orderId = o.id;
    }

    // Insert item per service
    for (const svcId of dto.serviceIds) {
      await this.ds.query(
        `INSERT INTO lab_order_items (lab_order_id, service_id, service_name, status)
         SELECT $1, s.id, s.name, 'pending' FROM services s WHERE s.id=$2`,
        [orderId, svcId],
      );
    }
    return { orderId, orderNo, message: 'Order lab berhasil dibuat' };
  }

  async getLabOrders(visitId: string) {
    return this.ds.query(
      `SELECT lo.*, e.full_name AS ordered_by_name,
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
       ORDER BY lo.ordered_at DESC`, [visitId],
    );
  }

  async inputLabResult(itemId: string, dto: LabResultDto, userId: string) {
    await this.ds.query(
      `UPDATE lab_order_items SET
         result_value=$1, result_unit=$2, normal_range=$3, result_flag=$4,
         result_at=NOW(), notes=$5, status='done', verified_by=$6
       WHERE id=$7`,
      [dto.resultValue, dto.resultUnit, dto.normalRange,
       dto.resultFlag, dto.notes, userId, itemId],
    );
    // Update status order jika semua item selesai
    await this.ds.query(
      `UPDATE lab_orders SET status='done'
       WHERE id=(SELECT lab_order_id FROM lab_order_items WHERE id=$1)
         AND NOT EXISTS (SELECT 1 FROM lab_order_items WHERE lab_order_id=(
           SELECT lab_order_id FROM lab_order_items WHERE id=$1
         ) AND status='pending')`, [itemId],
    );
    return { message: 'Hasil lab berhasil disimpan' };
  }

  // ── Radiology Order ───────────────────────────────────────────
  async createRadOrder(dto: CreateRadOrderDto, userId: string) {
    const d = new Date();
    const prefix = `RAD-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM radiology_orders WHERE order_no LIKE '${prefix}%'`);
    const orderNo = prefix + String(cnt.n).padStart(3,'0');

    const [row] = await this.ds.query(
      `INSERT INTO radiology_orders
         (order_no, visit_id, ordered_by, service_id, priority, clinical_info, status)
       VALUES ($1,$2,(SELECT doctor_id FROM visits WHERE id=$2),$3,$4,$5,'ordered')
       RETURNING *`,
      [orderNo, dto.visitId, dto.serviceId, dto.priority||'routine', dto.clinicalInfo],
    );
    return { ...row, message: 'Order radiologi berhasil dibuat' };
  }

  async getRadOrders(visitId: string) {
    return this.ds.query(
      `SELECT ro.*, s.name AS service_name,
              e.full_name AS ordered_by_name,
              ex.full_name AS expertise_by_name
       FROM radiology_orders ro
       JOIN services s ON s.id = ro.service_id
       LEFT JOIN doctors doc ON doc.id = ro.ordered_by
       LEFT JOIN employees e ON e.id = doc.employee_id
       LEFT JOIN doctors doc2 ON doc2.id = ro.expertise_by
       LEFT JOIN employees ex ON ex.id = doc2.employee_id
       WHERE ro.visit_id=$1 ORDER BY ro.ordered_at DESC`, [visitId],
    );
  }

  async inputRadResult(orderId: string, body: { expertise: string; imageUrls?: string[] }, userId: string) {
    await this.ds.query(
      `UPDATE radiology_orders SET
         expertise=$1, image_urls=$2, expertise_by=(
           SELECT doc.id FROM doctors doc WHERE doc.employee_id=(
             SELECT employee_id FROM users WHERE id=$3
           ) LIMIT 1
         ),
         expertise_at=NOW(), performed_at=NOW(), performed_by=$3, status='done'
       WHERE id=$4`,
      [body.expertise, JSON.stringify(body.imageUrls||[]), userId, orderId],
    );
    return { message: 'Hasil radiologi berhasil disimpan' };
  }

  // ── Prescription ──────────────────────────────────────────────
  async createPrescription(dto: CreatePrescriptionDto, userId: string) {
    const d = new Date();
    const prefix = `RX-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM prescriptions WHERE prescription_no LIKE '${prefix}%'`);
    const rxNo = prefix + String(cnt.n).padStart(3,'0');

    const [rx] = await this.ds.query(
      `INSERT INTO prescriptions (prescription_no, visit_id, prescribed_by, prescription_type, status, notes)
       VALUES ($1,$2,(SELECT doctor_id FROM visits WHERE id=$2),$3,'pending',$4) RETURNING id`,
      [rxNo, dto.visitId, dto.prescriptionType||'regular', dto.notes],
    );

    for (const item of dto.items) {
      await this.ds.query(
        `INSERT INTO prescription_items
           (prescription_id, drug_id, drug_name, drug_form, strength, quantity, unit,
            dosage_instruction, duration_days, route, is_generic)
         SELECT $1, d.id, d.generic_name, d.drug_form, d.strength, $2, $3, $4, $5, $6, $7
         FROM drugs d WHERE d.id=$8`,
        [rx.id, item.quantity, item.unit, item.dosageInstruction,
         item.durationDays, item.route, item.isGeneric||false, item.drugId],
      );
    }
    return { prescriptionId: rx.id, prescriptionNo: rxNo, message: 'Resep berhasil dibuat' };
  }

  async getPrescriptions(visitId: string) {
    return this.ds.query(
      `SELECT p.*,
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
       ORDER BY p.prescribed_at DESC`, [visitId],
    );
  }

  // ── Procedures ────────────────────────────────────────────────
  async addProcedure(dto: CreateProcedureDto, userId: string) {
    const [row] = await this.ds.query(
      `INSERT INTO visit_procedures (visit_id, service_id, icd9_id, performed_by, quantity, notes)
       VALUES ($1,$2,$3,(
         SELECT doc.id FROM doctors doc WHERE doc.employee_id=(
           SELECT employee_id FROM users WHERE id=$4
         ) LIMIT 1
       ),$5,$6) RETURNING *`,
      [dto.visitId, dto.serviceId, dto.icd9Id, userId, dto.quantity||1, dto.notes],
    );
    return row;
  }

  async getProcedures(visitId: string) {
    return this.ds.query(
      `SELECT vp.*, s.name AS service_name, s.service_type,
              i9.code AS icd9_code, i9.name_id AS procedure_name,
              e.full_name AS performed_by_name
       FROM visit_procedures vp
       JOIN services s ON s.id = vp.service_id
       LEFT JOIN icd9_procedures i9 ON i9.id = vp.icd9_id
       JOIN doctors doc ON doc.id = vp.performed_by
       JOIN employees e ON e.id = doc.employee_id
       WHERE vp.visit_id=$1 ORDER BY vp.performed_at`, [visitId],
    );
  }

  // ── ICD search ────────────────────────────────────────────────
  async searchIcd10(q: string, limit = 20) {
    return this.ds.query(
      `SELECT id, code, name_id, name_en, category
       FROM icd10_diagnoses
       WHERE (code ILIKE $1 OR name_id ILIKE $1) AND is_active=true
       ORDER BY code LIMIT $2`, [`%${q}%`, limit],
    );
  }

  async searchIcd9(q: string, limit = 20) {
    return this.ds.query(
      `SELECT id, code, name_id, name_en FROM icd9_procedures
       WHERE (code ILIKE $1 OR name_id ILIKE $1) AND is_active=true
       ORDER BY code LIMIT $2`, [`%${q}%`, limit],
    );
  }
}

// ── Controller ────────────────────────────────────────────────────
@ApiTags('EMR')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('emr')
export class EmrController {
  constructor(private readonly svc: EmrService) {}

  // Notes / SOAP
  @Post('notes') @ApiOperation({ summary: 'Tulis SOAP/catatan medis' })
  createNote(@Body() dto: CreateSoapDto, @CurrentUser('id') uid: string) { return this.svc.createNote(dto, uid); }
  @Get('notes/:visitId') @ApiOperation({ summary: 'Catatan medis per kunjungan' })
  getNotes(@Param('visitId') id: string) { return this.svc.getNotes(id); }
  @Patch('notes/:id/lock') @ApiOperation({ summary: 'Kunci catatan medis (final)' })
  lockNote(@Param('id') id: string) { return this.svc.lockNote(id); }

  // Diagnosa
  @Post('diagnoses') @ApiOperation({ summary: 'Tambah diagnosa ICD-10' })
  addDiagnosis(@Body() dto: AddDiagnosisDto, @CurrentUser('id') uid: string) { return this.svc.addDiagnosis(dto, uid); }
  @Get('diagnoses/:visitId') @ApiOperation({ summary: 'Diagnosa per kunjungan' })
  getDiagnoses(@Param('visitId') id: string) { return this.svc.getDiagnoses(id); }
  @Delete('diagnoses/:id') @ApiOperation({ summary: 'Hapus diagnosa' })
  removeDiagnosis(@Param('id') id: string) { return this.svc.removeDiagnosis(id); }

  // Lab
  @Post('lab-orders') @ApiOperation({ summary: 'Order pemeriksaan lab' })
  createLab(@Body() dto: CreateLabOrderDto, @CurrentUser('id') uid: string) { return this.svc.createLabOrder(dto, uid); }
  @Get('lab-orders/:visitId') @ApiOperation({ summary: 'Order lab per kunjungan' })
  getLab(@Param('visitId') id: string) { return this.svc.getLabOrders(id); }
  @Patch('lab-orders/items/:itemId/result') @ApiOperation({ summary: 'Input hasil lab' })
  inputLabResult(@Param('itemId') id: string, @Body() dto: LabResultDto, @CurrentUser('id') uid: string) {
    return this.svc.inputLabResult(id, dto, uid);
  }

  // Radiology
  @Post('rad-orders') @ApiOperation({ summary: 'Order pemeriksaan radiologi' })
  createRad(@Body() dto: CreateRadOrderDto, @CurrentUser('id') uid: string) { return this.svc.createRadOrder(dto, uid); }
  @Get('rad-orders/:visitId') @ApiOperation({ summary: 'Order radiologi per kunjungan' })
  getRad(@Param('visitId') id: string) { return this.svc.getRadOrders(id); }
  @Patch('rad-orders/:id/result') @ApiOperation({ summary: 'Input expertise/hasil radiologi' })
  inputRadResult(@Param('id') id: string, @Body() body: any, @CurrentUser('id') uid: string) {
    return this.svc.inputRadResult(id, body, uid);
  }

  // Prescription
  @Post('prescriptions') @ApiOperation({ summary: 'Tulis resep' })
  createRx(@Body() dto: CreatePrescriptionDto, @CurrentUser('id') uid: string) { return this.svc.createPrescription(dto, uid); }
  @Get('prescriptions/:visitId') @ApiOperation({ summary: 'Resep per kunjungan' })
  getRx(@Param('visitId') id: string) { return this.svc.getPrescriptions(id); }

  // Procedures
  @Post('procedures') @ApiOperation({ summary: 'Input tindakan medis' })
  addProc(@Body() dto: CreateProcedureDto, @CurrentUser('id') uid: string) { return this.svc.addProcedure(dto, uid); }
  @Get('procedures/:visitId') @ApiOperation({ summary: 'Tindakan per kunjungan' })
  getProcs(@Param('visitId') id: string) { return this.svc.getProcedures(id); }

  // Search ICD
  @Get('icd10') @ApiOperation({ summary: 'Cari kode ICD-10' })
  searchIcd10(@Query('q') q: string, @Query('limit') limit = 20) { return this.svc.searchIcd10(q, +limit); }
  @Get('icd9') @ApiOperation({ summary: 'Cari kode ICD-9-CM prosedur' })
  searchIcd9(@Query('q') q: string, @Query('limit') limit = 20) { return this.svc.searchIcd9(q, +limit); }
}

// ── Module ────────────────────────────────────────────────────────
@Module({
  controllers: [EmrController],
  providers: [EmrService],
  exports: [EmrService],
})
export class EmrModule {}
