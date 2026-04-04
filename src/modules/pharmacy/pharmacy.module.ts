import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IsUUID, IsOptional, IsString, IsNumber, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators';

// ── DTOs ──────────────────────────────────────────────────────────
export class DispenseDto {
  @ApiProperty() @IsUUID() prescriptionId: string;
  @ApiProperty() @IsUUID() warehouseId: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class StockAdjustmentDto {
  @ApiProperty() @IsUUID() warehouseId: string;
  @ApiProperty() @IsUUID() drugId: string;
  @ApiProperty() @IsString() batchNo: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiredDate?: string;
  @ApiProperty() @IsNumber() quantity: number;
  @ApiPropertyOptional({ enum: ['in_adjustment','out_adjustment'] })
  @IsOptional() mutationType?: string;
  @ApiProperty() @IsNumber() unitPrice: number;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class CreatePoDto {
  @ApiProperty() @IsUUID() warehouseId: string;
  @ApiProperty() @IsString() supplierName: string;
  @ApiPropertyOptional() @IsOptional() supplierCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expectedDate?: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
  @ApiProperty({ type: [Object] }) items: PoItemDto[];
}

export class PoItemDto {
  @ApiProperty() @IsUUID() drugId: string;
  @ApiProperty() @IsNumber() quantityOrder: number;
  @ApiProperty() @IsString() unit: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() unitPrice?: number;
}

export class ReceivePoDto {
  @ApiProperty({ type: [Object] }) items: ReceivePoItemDto[];
}

export class ReceivePoItemDto {
  @ApiProperty() @IsUUID() poItemId: string;
  @ApiProperty() @IsNumber() quantityReceived: number;
  @ApiPropertyOptional() @IsOptional() batchNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiredDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() unitPrice?: number;
}

export class DrugSearchDto {
  @ApiPropertyOptional() @IsOptional() search?: string;
  @ApiPropertyOptional() @IsOptional() warehouseId?: string;
  @ApiPropertyOptional() @IsOptional() drugClassCode?: string;
  @ApiPropertyOptional() @IsOptional() isFormularium?: boolean;
  @ApiPropertyOptional() @IsOptional() page?: number;
  @ApiPropertyOptional() @IsOptional() limit?: number;
}

// ── Service ───────────────────────────────────────────────────────
@Injectable()
export class PharmacyService {
  constructor(private ds: DataSource) {}

  // ── Pending prescriptions (antrian dispensing) ────────────────
  async getPendingRx(warehouseId?: string) {
    return this.ds.query(
      `SELECT p.id, p.prescription_no, p.prescription_type, p.prescribed_at, p.status,
              v.visit_number, v.visit_type,
              pat.full_name AS patient_name, pat.medical_record_no,
              e.full_name AS doctor_name,
              COUNT(pi.id) AS item_count
       FROM prescriptions p
       JOIN visits v ON v.id = p.visit_id
       JOIN patients pat ON pat.id = v.patient_id
       JOIN doctors doc ON doc.id = p.prescribed_by
       JOIN employees e ON e.id = doc.employee_id
       JOIN prescription_items pi ON pi.prescription_id = p.id
       WHERE p.status='pending'
       GROUP BY p.id, v.visit_number, v.visit_type,
                pat.full_name, pat.medical_record_no, e.full_name
       ORDER BY p.prescribed_at`,
    );
  }

  async getRxDetail(rxId: string) {
    const [rx] = await this.ds.query(
      `SELECT p.*, pat.full_name AS patient_name, pat.bpjs_number,
              e.full_name AS doctor_name, v.visit_number
       FROM prescriptions p
       JOIN visits v ON v.id = p.visit_id
       JOIN patients pat ON pat.id = v.patient_id
       JOIN doctors doc ON doc.id = p.prescribed_by
       JOIN employees e ON e.id = doc.employee_id
       WHERE p.id=$1`, [rxId],
    );
    if (!rx) throw new NotFoundException('Resep tidak ditemukan');

    const items = await this.ds.query(
      `SELECT pi.*, d.generic_name, d.brand_name, d.drug_form, d.strength,
              -- Stok tersedia di depo
              COALESCE((
                SELECT SUM(ds.quantity) FROM drug_stocks ds WHERE ds.drug_id=pi.drug_id
              ),0) AS available_stock
       FROM prescription_items pi
       JOIN drugs d ON d.id = pi.drug_id
       WHERE pi.prescription_id=$1`, [rxId],
    );
    return { ...rx, items };
  }

  async dispense(dto: DispenseDto, userId: string) {
    // Cek stok semua item
    const items = await this.ds.query(
      `SELECT pi.*, d.generic_name FROM prescription_items pi
       JOIN drugs d ON d.id = pi.drug_id WHERE pi.prescription_id=$1`, [dto.prescriptionId],
    );
    for (const item of items) {
      const [stock] = await this.ds.query(
        `SELECT COALESCE(SUM(quantity),0) AS qty FROM drug_stocks
         WHERE warehouse_id=$1 AND drug_id=$2`, [dto.warehouseId, item.drug_id],
      );
      if (+stock.qty < item.quantity) {
        throw new BadRequestException(`Stok ${item.generic_name} tidak mencukupi (tersedia: ${stock.qty}, dibutuhkan: ${item.quantity})`);
      }
    }

    const d = new Date();
    const prefix = `DSP-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM dispensings WHERE dispensing_no LIKE '${prefix}%'`);
    const no = prefix + String(cnt.n).padStart(3,'0');

    const [disp] = await this.ds.query(
      `INSERT INTO dispensings (dispensing_no, prescription_id, warehouse_id, dispensed_by, status)
       VALUES ($1,$2,$3,$4,'dispensed') RETURNING id`,
      [no, dto.prescriptionId, dto.warehouseId, userId],
    );

    // Insert dispensing items + kurangi stok
    for (const item of items) {
      // Ambil batch dengan FIFO (expired paling awal dulu)
      const [stock] = await this.ds.query(
        `SELECT id, batch_no, unit_price FROM drug_stocks
         WHERE warehouse_id=$1 AND drug_id=$2 AND quantity>0
         ORDER BY expired_date NULLS LAST LIMIT 1`,
        [dto.warehouseId, item.drug_id],
      );

      await this.ds.query(
        `INSERT INTO dispensing_items
           (dispensing_id, prescription_item_id, drug_id, drug_stock_id,
            quantity, unit, unit_price, batch_no)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [disp.id, item.id, item.drug_id, stock?.id,
         item.quantity, item.unit, stock?.unit_price||0, stock?.batch_no],
      );

      // Kurangi stok + catat mutasi
      if (stock) {
        const [before] = await this.ds.query(
          `SELECT quantity FROM drug_stocks WHERE id=$1`, [stock.id],
        );
        await this.ds.query(
          `UPDATE drug_stocks SET quantity = quantity - $1 WHERE id=$2`, [item.quantity, stock.id],
        );
        await this.ds.query(
          `INSERT INTO stock_mutations
             (warehouse_id, drug_id, batch_no, mutation_type, quantity, unit_price,
              reference_id, reference_type, done_by, qty_before, qty_after)
           VALUES ($1,$2,$3,'out_dispense',$4,$5,$6,'dispensings',$7,$8,$9)`,
          [dto.warehouseId, item.drug_id, stock.batch_no, item.quantity,
           stock.unit_price, disp.id, userId, before.quantity, before.quantity - item.quantity],
        );
      }
    }

    await this.ds.query(
      `UPDATE prescriptions SET status='dispensed', dispensed_by=$1, dispensed_at=NOW()
       WHERE id=$2`, [userId, dto.prescriptionId],
    );

    return { dispensingNo: no, message: 'Dispensing berhasil' };
  }

  // ── Stok ──────────────────────────────────────────────────────
  async getStock(warehouseId?: string, search?: string, lowStock = false) {
    let where = 'WHERE dr.is_active=true';
    const p: any[] = [];
    if (warehouseId) { p.push(warehouseId); where += ` AND ds.warehouse_id=$${p.length}`; }
    if (search) { p.push(`%${search}%`); where += ` AND (dr.generic_name ILIKE $${p.length} OR dr.code ILIKE $${p.length})`; }
    if (lowStock) where += ` AND ds.quantity <= ds.reorder_level`;

    return this.ds.query(
      `SELECT ds.id, w.name AS warehouse_name, dr.code, dr.generic_name,
              dr.brand_name, dr.drug_form, dr.strength, dc.name AS drug_class,
              ds.batch_no, ds.expired_date, ds.quantity, ds.unit,
              ds.unit_price, ds.reorder_level,
              CASE WHEN ds.quantity <= 0 THEN 'out_of_stock'
                   WHEN ds.quantity <= ds.reorder_level THEN 'low_stock'
                   ELSE 'available' END AS stock_status
       FROM drug_stocks ds
       JOIN pharmacy_warehouses w ON w.id = ds.warehouse_id
       JOIN drugs dr ON dr.id = ds.drug_id
       JOIN drug_classes dc ON dc.id = dr.drug_class_id
       ${where} ORDER BY dr.generic_name`, p,
    );
  }

  async adjustStock(dto: StockAdjustmentDto, userId: string) {
    const [existing] = await this.ds.query(
      `SELECT id, quantity FROM drug_stocks WHERE warehouse_id=$1 AND drug_id=$2 AND batch_no=$3`,
      [dto.warehouseId, dto.drugId, dto.batchNo],
    );

    const isIn    = dto.mutationType === 'in_adjustment';
    const before  = existing?.quantity ?? 0;
    const after   = isIn ? before + dto.quantity : before - dto.quantity;
    if (after < 0) throw new BadRequestException('Stok tidak bisa negatif');

    if (existing) {
      await this.ds.query(`UPDATE drug_stocks SET quantity=$1, updated_at=NOW() WHERE id=$2`, [after, existing.id]);
    } else {
      await this.ds.query(
        `INSERT INTO drug_stocks (warehouse_id, drug_id, batch_no, expired_date, quantity, unit, unit_price)
         VALUES ($1,$2,$3,$4,$5,'item',$6)`,
        [dto.warehouseId, dto.drugId, dto.batchNo, dto.expiredDate, after, dto.unitPrice],
      );
    }

    await this.ds.query(
      `INSERT INTO stock_mutations
         (warehouse_id, drug_id, batch_no, mutation_type, quantity, unit_price,
          done_by, qty_before, qty_after, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [dto.warehouseId, dto.drugId, dto.batchNo, dto.mutationType||'in_adjustment',
       dto.quantity, dto.unitPrice, userId, before, after, dto.notes],
    );
    return { message: 'Penyesuaian stok berhasil', before, after };
  }

  async getStockMutations(warehouseId: string, drugId?: string, startDate?: string, endDate?: string) {
    let where = `WHERE sm.warehouse_id=$1`;
    const p: any[] = [warehouseId];
    if (drugId)    { p.push(drugId);    where += ` AND sm.drug_id=$${p.length}`; }
    if (startDate) { p.push(startDate); where += ` AND sm.mutation_date>=$${p.length}`; }
    if (endDate)   { p.push(endDate);   where += ` AND sm.mutation_date<=$${p.length}`; }

    return this.ds.query(
      `SELECT sm.*, dr.generic_name, dr.code AS drug_code,
              u.full_name AS done_by_name
       FROM stock_mutations sm
       JOIN drugs dr ON dr.id = sm.drug_id
       LEFT JOIN users u ON u.id = sm.done_by
       ${where} ORDER BY sm.mutation_date DESC LIMIT 200`, p,
    );
  }

  // ── Purchase Order ────────────────────────────────────────────
  async createPO(dto: CreatePoDto, userId: string) {
    const d = new Date();
    const prefix = `PO-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM purchase_orders WHERE po_number LIKE '${prefix}%'`);
    const no = prefix + String(cnt.n).padStart(4,'0');

    const [po] = await this.ds.query(
      `INSERT INTO purchase_orders
         (po_number, warehouse_id, supplier_name, supplier_code, expected_date, status, created_by)
       VALUES ($1,$2,$3,$4,$5,'draft',$6) RETURNING id`,
      [no, dto.warehouseId, dto.supplierName, dto.supplierCode, dto.expectedDate, userId],
    );
    for (const item of dto.items) {
      await this.ds.query(
        `INSERT INTO purchase_order_items (po_id, drug_id, quantity_order, unit, unit_price)
         VALUES ($1,$2,$3,$4,$5)`,
        [po.id, item.drugId, item.quantityOrder, item.unit, item.unitPrice],
      );
    }
    const total = dto.items.reduce((s,i) => s + (i.quantityOrder * (i.unitPrice||0)), 0);
    await this.ds.query(`UPDATE purchase_orders SET total_amount=$1 WHERE id=$2`, [total, po.id]);
    return { poId: po.id, poNumber: no, message: 'PO berhasil dibuat' };
  }

  async getPOs(status?: string, warehouseId?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (status)      { p.push(status);      where += ` AND po.status=$${p.length}`; }
    if (warehouseId) { p.push(warehouseId); where += ` AND po.warehouse_id=$${p.length}`; }
    return this.ds.query(
      `SELECT po.*, w.name AS warehouse_name,
              u_c.full_name AS created_by_name, u_a.full_name AS approved_by_name
       FROM purchase_orders po
       JOIN pharmacy_warehouses w ON w.id = po.warehouse_id
       LEFT JOIN users u_c ON u_c.id = po.created_by
       LEFT JOIN users u_a ON u_a.id = po.approved_by
       ${where} ORDER BY po.created_at DESC`, p,
    );
  }

  async approvePO(poId: string, userId: string) {
    await this.ds.query(
      `UPDATE purchase_orders SET status='submitted', approved_by=$1 WHERE id=$2`, [userId, poId],
    );
    return { message: 'PO disetujui dan dikirim ke supplier' };
  }

  async receivePO(poId: string, dto: ReceivePoDto, userId: string) {
    for (const item of dto.items) {
      const [poi] = await this.ds.query(
        `UPDATE purchase_order_items SET quantity_received=$1, batch_no=$2, expired_date=$3, unit_price=$4
         WHERE id=$5 RETURNING drug_id, quantity_received, unit, unit_price`,
        [item.quantityReceived, item.batchNo, item.expiredDate, item.unitPrice, item.poItemId],
      );

      if (!poi) continue;
      const [po] = await this.ds.query(`SELECT warehouse_id FROM purchase_orders WHERE id=$1`, [poId]);

      // Update atau insert stok
      const [existing] = await this.ds.query(
        `SELECT id, quantity FROM drug_stocks WHERE warehouse_id=$1 AND drug_id=$2 AND batch_no=$3`,
        [po.warehouse_id, poi.drug_id, item.batchNo],
      );
      if (existing) {
        await this.ds.query(
          `UPDATE drug_stocks SET quantity=quantity+$1, updated_at=NOW() WHERE id=$2`,
          [item.quantityReceived, existing.id],
        );
      } else {
        await this.ds.query(
          `INSERT INTO drug_stocks (warehouse_id, drug_id, batch_no, expired_date, quantity, unit, unit_price)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [po.warehouse_id, poi.drug_id, item.batchNo, item.expiredDate,
           item.quantityReceived, poi.unit, item.unitPrice||0],
        );
      }
      await this.ds.query(
        `INSERT INTO stock_mutations
           (warehouse_id, drug_id, batch_no, mutation_type, quantity, unit_price,
            reference_id, reference_type, done_by, qty_before, qty_after)
         VALUES ($1,$2,$3,'in_purchase',$4,$5,$6,'purchase_orders',$7,$8,$9)`,
        [po.warehouse_id, poi.drug_id, item.batchNo, item.quantityReceived,
         item.unitPrice||0, poId, userId,
         existing?.quantity||0, (existing?.quantity||0)+item.quantityReceived],
      );
    }
    await this.ds.query(
      `UPDATE purchase_orders SET status='received' WHERE id=$1`, [poId],
    );
    return { message: 'Penerimaan barang berhasil dicatat' };
  }

  // ── Drug catalog ──────────────────────────────────────────────
  async searchDrugs(q: DrugSearchDto) {
    const page = q.page??1; const limit = q.limit??20;
    const offset = (page-1)*limit;
    let where = 'WHERE d.is_active=true';
    const p: any[] = [];
    if (q.search) { p.push(`%${q.search}%`); where += ` AND (d.generic_name ILIKE $${p.length} OR d.brand_name ILIKE $${p.length} OR d.code ILIKE $${p.length})`; }
    if (q.drugClassCode) { p.push(q.drugClassCode); where += ` AND dc.code=$${p.length}`; }
    if (q.isFormularium !== undefined) where += ` AND d.is_formularium=${q.isFormularium}`;
    p.push(limit); p.push(offset);
    return this.ds.query(
      `SELECT d.id, d.code, d.generic_name, d.brand_name, d.drug_form,
              d.strength, d.unit, d.is_formularium, d.is_narcotic,
              dc.name AS drug_class, dc.requires_prescription
       FROM drugs d JOIN drug_classes dc ON dc.id = d.drug_class_id
       ${where} ORDER BY d.generic_name
       LIMIT $${p.length-1} OFFSET $${p.length}`, p,
    );
  }

  async getLowStockAlert(warehouseId?: string) {
    let where = 'WHERE dr.is_active=true AND ds.quantity <= ds.reorder_level AND ds.reorder_level > 0';
    const p: any[] = [];
    if (warehouseId) { p.push(warehouseId); where += ` AND ds.warehouse_id=$${p.length}`; }
    return this.ds.query(
      `SELECT w.name AS warehouse_name, dr.code, dr.generic_name, dr.brand_name,
              ds.quantity AS current_qty, ds.reorder_level,
              ds.unit, ds.expired_date,
              CASE WHEN ds.quantity = 0 THEN 'HABIS' ELSE 'HAMPIR HABIS' END AS alert_level
       FROM drug_stocks ds
       JOIN pharmacy_warehouses w ON w.id = ds.warehouse_id
       JOIN drugs dr ON dr.id = ds.drug_id
       ${where} ORDER BY (ds.quantity::float/NULLIF(ds.reorder_level,0))`, p,
    );
  }

  async getExpiringDrugs(daysAhead = 90, warehouseId?: string) {
    let where = `WHERE ds.expired_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${daysAhead} days'`;
    const p: any[] = [];
    if (warehouseId) { p.push(warehouseId); where += ` AND ds.warehouse_id=$${p.length}`; }
    return this.ds.query(
      `SELECT w.name AS warehouse_name, dr.generic_name, dr.brand_name,
              ds.batch_no, ds.expired_date, ds.quantity, ds.unit,
              (ds.expired_date - CURRENT_DATE) AS days_to_expire
       FROM drug_stocks ds
       JOIN pharmacy_warehouses w ON w.id = ds.warehouse_id
       JOIN drugs dr ON dr.id = ds.drug_id
       ${where} AND ds.quantity > 0
       ORDER BY ds.expired_date`, p,
    );
  }
}

// ── Controller ────────────────────────────────────────────────────
@ApiTags('Pharmacy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly svc: PharmacyService) {}

  @Get('prescriptions/pending') @ApiOperation({ summary: 'Antrian resep pending' })
  pending() { return this.svc.getPendingRx(); }
  @Get('prescriptions/:id') @ApiOperation({ summary: 'Detail resep + cek stok' })
  rxDetail(@Param('id') id: string) { return this.svc.getRxDetail(id); }
  @Post('dispense') @ApiOperation({ summary: 'Dispensing resep' })
  dispense(@Body() dto: DispenseDto, @CurrentUser('id') uid: string) { return this.svc.dispense(dto, uid); }

  @Get('stock') @ApiOperation({ summary: 'Lihat stok obat' })
  stock(@Query('warehouseId') wh?: string, @Query('search') s?: string, @Query('lowStock') ls?: string) {
    return this.svc.getStock(wh, s, ls === 'true');
  }
  @Post('stock/adjust') @ApiOperation({ summary: 'Penyesuaian stok (opname)' })
  adjust(@Body() dto: StockAdjustmentDto, @CurrentUser('id') uid: string) { return this.svc.adjustStock(dto, uid); }
  @Get('stock/mutations') @ApiOperation({ summary: 'Riwayat mutasi stok' })
  mutations(@Query('warehouseId') wh: string, @Query('drugId') d?: string,
    @Query('startDate') s?: string, @Query('endDate') e?: string) {
    return this.svc.getStockMutations(wh, d, s, e);
  }
  @Get('stock/alerts/low') @ApiOperation({ summary: 'Alert stok hampir habis' })
  lowStock(@Query('warehouseId') wh?: string) { return this.svc.getLowStockAlert(wh); }
  @Get('stock/alerts/expiring') @ApiOperation({ summary: 'Obat mendekati kadaluarsa' })
  expiring(@Query('days') d = 90, @Query('warehouseId') wh?: string) { return this.svc.getExpiringDrugs(+d, wh); }

  @Post('purchase-orders') @ApiOperation({ summary: 'Buat Purchase Order' })
  createPO(@Body() dto: CreatePoDto, @CurrentUser('id') uid: string) { return this.svc.createPO(dto, uid); }
  @Get('purchase-orders') @ApiOperation({ summary: 'Daftar PO' })
  getPOs(@Query('status') s?: string, @Query('warehouseId') wh?: string) { return this.svc.getPOs(s, wh); }
  @Patch('purchase-orders/:id/approve') @ApiOperation({ summary: 'Approve PO' })
  approvePO(@Param('id') id: string, @CurrentUser('id') uid: string) { return this.svc.approvePO(id, uid); }
  @Post('purchase-orders/:id/receive') @ApiOperation({ summary: 'Terima barang dari PO' })
  receivePO(@Param('id') id: string, @Body() dto: ReceivePoDto, @CurrentUser('id') uid: string) {
    return this.svc.receivePO(id, dto, uid);
  }

  @Get('drugs') @ApiOperation({ summary: 'Katalog obat formularium' })
  drugs(@Query() q: DrugSearchDto) { return this.svc.searchDrugs(q); }
}

@Module({
  controllers: [PharmacyController],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
