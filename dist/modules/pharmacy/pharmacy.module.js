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
exports.PharmacyModule = exports.PharmacyController = exports.PharmacyService = exports.DrugSearchDto = exports.ReceivePoItemDto = exports.ReceivePoDto = exports.PoItemDto = exports.CreatePoDto = exports.StockAdjustmentDto = exports.DispenseDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const auth_guard_1 = require("../../common/guards/auth.guard");
const decorators_1 = require("../../common/decorators");
class DispenseDto {
    prescriptionId;
    warehouseId;
    notes;
}
exports.DispenseDto = DispenseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DispenseDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DispenseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DispenseDto.prototype, "notes", void 0);
class StockAdjustmentDto {
    warehouseId;
    drugId;
    batchNo;
    expiredDate;
    quantity;
    mutationType;
    unitPrice;
    notes;
}
exports.StockAdjustmentDto = StockAdjustmentDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "drugId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "batchNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "expiredDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockAdjustmentDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['in_adjustment', 'out_adjustment'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "mutationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StockAdjustmentDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], StockAdjustmentDto.prototype, "notes", void 0);
class CreatePoDto {
    warehouseId;
    supplierName;
    supplierCode;
    expectedDate;
    notes;
    items;
}
exports.CreatePoDto = CreatePoDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePoDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePoDto.prototype, "supplierName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePoDto.prototype, "supplierCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePoDto.prototype, "expectedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePoDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], CreatePoDto.prototype, "items", void 0);
class PoItemDto {
    drugId;
    quantityOrder;
    unit;
    unitPrice;
}
exports.PoItemDto = PoItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PoItemDto.prototype, "drugId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PoItemDto.prototype, "quantityOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PoItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PoItemDto.prototype, "unitPrice", void 0);
class ReceivePoDto {
    items;
}
exports.ReceivePoDto = ReceivePoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], ReceivePoDto.prototype, "items", void 0);
class ReceivePoItemDto {
    poItemId;
    quantityReceived;
    batchNo;
    expiredDate;
    unitPrice;
}
exports.ReceivePoItemDto = ReceivePoItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ReceivePoItemDto.prototype, "poItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReceivePoItemDto.prototype, "quantityReceived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReceivePoItemDto.prototype, "batchNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ReceivePoItemDto.prototype, "expiredDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReceivePoItemDto.prototype, "unitPrice", void 0);
class DrugSearchDto {
    search;
    warehouseId;
    drugClassCode;
    isFormularium;
    page;
    limit;
}
exports.DrugSearchDto = DrugSearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DrugSearchDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DrugSearchDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], DrugSearchDto.prototype, "drugClassCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], DrugSearchDto.prototype, "isFormularium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DrugSearchDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], DrugSearchDto.prototype, "limit", void 0);
let PharmacyService = class PharmacyService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    async getPendingRx(warehouseId) {
        return this.ds.query(`SELECT p.id, p.prescription_no, p.prescription_type, p.prescribed_at, p.status,
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
       ORDER BY p.prescribed_at`);
    }
    async getRxDetail(rxId) {
        const [rx] = await this.ds.query(`SELECT p.*, pat.full_name AS patient_name, pat.bpjs_number,
              e.full_name AS doctor_name, v.visit_number
       FROM prescriptions p
       JOIN visits v ON v.id = p.visit_id
       JOIN patients pat ON pat.id = v.patient_id
       JOIN doctors doc ON doc.id = p.prescribed_by
       JOIN employees e ON e.id = doc.employee_id
       WHERE p.id=$1`, [rxId]);
        if (!rx)
            throw new common_1.NotFoundException('Resep tidak ditemukan');
        const items = await this.ds.query(`SELECT pi.*, d.generic_name, d.brand_name, d.drug_form, d.strength,
              -- Stok tersedia di depo
              COALESCE((
                SELECT SUM(ds.quantity) FROM drug_stocks ds WHERE ds.drug_id=pi.drug_id
              ),0) AS available_stock
       FROM prescription_items pi
       JOIN drugs d ON d.id = pi.drug_id
       WHERE pi.prescription_id=$1`, [rxId]);
        return { ...rx, items };
    }
    async dispense(dto, userId) {
        const items = await this.ds.query(`SELECT pi.*, d.generic_name FROM prescription_items pi
       JOIN drugs d ON d.id = pi.drug_id WHERE pi.prescription_id=$1`, [dto.prescriptionId]);
        for (const item of items) {
            const [stock] = await this.ds.query(`SELECT COALESCE(SUM(quantity),0) AS qty FROM drug_stocks
         WHERE warehouse_id=$1 AND drug_id=$2`, [dto.warehouseId, item.drug_id]);
            if (+stock.qty < item.quantity) {
                throw new common_1.BadRequestException(`Stok ${item.generic_name} tidak mencukupi (tersedia: ${stock.qty}, dibutuhkan: ${item.quantity})`);
            }
        }
        const d = new Date();
        const prefix = `DSP-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM dispensings WHERE dispensing_no LIKE '${prefix}%'`);
        const no = prefix + String(cnt.n).padStart(3, '0');
        const [disp] = await this.ds.query(`INSERT INTO dispensings (dispensing_no, prescription_id, warehouse_id, dispensed_by, status)
       VALUES ($1,$2,$3,$4,'dispensed') RETURNING id`, [no, dto.prescriptionId, dto.warehouseId, userId]);
        for (const item of items) {
            const [stock] = await this.ds.query(`SELECT id, batch_no, unit_price FROM drug_stocks
         WHERE warehouse_id=$1 AND drug_id=$2 AND quantity>0
         ORDER BY expired_date NULLS LAST LIMIT 1`, [dto.warehouseId, item.drug_id]);
            await this.ds.query(`INSERT INTO dispensing_items
           (dispensing_id, prescription_item_id, drug_id, drug_stock_id,
            quantity, unit, unit_price, batch_no)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [disp.id, item.id, item.drug_id, stock?.id,
                item.quantity, item.unit, stock?.unit_price || 0, stock?.batch_no]);
            if (stock) {
                const [before] = await this.ds.query(`SELECT quantity FROM drug_stocks WHERE id=$1`, [stock.id]);
                await this.ds.query(`UPDATE drug_stocks SET quantity = quantity - $1 WHERE id=$2`, [item.quantity, stock.id]);
                await this.ds.query(`INSERT INTO stock_mutations
             (warehouse_id, drug_id, batch_no, mutation_type, quantity, unit_price,
              reference_id, reference_type, done_by, qty_before, qty_after)
           VALUES ($1,$2,$3,'out_dispense',$4,$5,$6,'dispensings',$7,$8,$9)`, [dto.warehouseId, item.drug_id, stock.batch_no, item.quantity,
                    stock.unit_price, disp.id, userId, before.quantity, before.quantity - item.quantity]);
            }
        }
        await this.ds.query(`UPDATE prescriptions SET status='dispensed', dispensed_by=$1, dispensed_at=NOW()
       WHERE id=$2`, [userId, dto.prescriptionId]);
        return { dispensingNo: no, message: 'Dispensing berhasil' };
    }
    async getStock(warehouseId, search, lowStock = false) {
        let where = 'WHERE dr.is_active=true';
        const p = [];
        if (warehouseId) {
            p.push(warehouseId);
            where += ` AND ds.warehouse_id=$${p.length}`;
        }
        if (search) {
            p.push(`%${search}%`);
            where += ` AND (dr.generic_name ILIKE $${p.length} OR dr.code ILIKE $${p.length})`;
        }
        if (lowStock)
            where += ` AND ds.quantity <= ds.reorder_level`;
        return this.ds.query(`SELECT ds.id, w.name AS warehouse_name, dr.code, dr.generic_name,
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
       ${where} ORDER BY dr.generic_name`, p);
    }
    async adjustStock(dto, userId) {
        const [existing] = await this.ds.query(`SELECT id, quantity FROM drug_stocks WHERE warehouse_id=$1 AND drug_id=$2 AND batch_no=$3`, [dto.warehouseId, dto.drugId, dto.batchNo]);
        const isIn = dto.mutationType === 'in_adjustment';
        const before = existing?.quantity ?? 0;
        const after = isIn ? before + dto.quantity : before - dto.quantity;
        if (after < 0)
            throw new common_1.BadRequestException('Stok tidak bisa negatif');
        if (existing) {
            await this.ds.query(`UPDATE drug_stocks SET quantity=$1, updated_at=NOW() WHERE id=$2`, [after, existing.id]);
        }
        else {
            await this.ds.query(`INSERT INTO drug_stocks (warehouse_id, drug_id, batch_no, expired_date, quantity, unit, unit_price)
         VALUES ($1,$2,$3,$4,$5,'item',$6)`, [dto.warehouseId, dto.drugId, dto.batchNo, dto.expiredDate, after, dto.unitPrice]);
        }
        await this.ds.query(`INSERT INTO stock_mutations
         (warehouse_id, drug_id, batch_no, mutation_type, quantity, unit_price,
          done_by, qty_before, qty_after, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [dto.warehouseId, dto.drugId, dto.batchNo, dto.mutationType || 'in_adjustment',
            dto.quantity, dto.unitPrice, userId, before, after, dto.notes]);
        return { message: 'Penyesuaian stok berhasil', before, after };
    }
    async getStockMutations(warehouseId, drugId, startDate, endDate) {
        let where = `WHERE sm.warehouse_id=$1`;
        const p = [warehouseId];
        if (drugId) {
            p.push(drugId);
            where += ` AND sm.drug_id=$${p.length}`;
        }
        if (startDate) {
            p.push(startDate);
            where += ` AND sm.mutation_date>=$${p.length}`;
        }
        if (endDate) {
            p.push(endDate);
            where += ` AND sm.mutation_date<=$${p.length}`;
        }
        return this.ds.query(`SELECT sm.*, dr.generic_name, dr.code AS drug_code,
              u.full_name AS done_by_name
       FROM stock_mutations sm
       JOIN drugs dr ON dr.id = sm.drug_id
       LEFT JOIN users u ON u.id = sm.done_by
       ${where} ORDER BY sm.mutation_date DESC LIMIT 200`, p);
    }
    async createPO(dto, userId) {
        const d = new Date();
        const prefix = `PO-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM purchase_orders WHERE po_number LIKE '${prefix}%'`);
        const no = prefix + String(cnt.n).padStart(4, '0');
        const [po] = await this.ds.query(`INSERT INTO purchase_orders
         (po_number, warehouse_id, supplier_name, supplier_code, expected_date, status, created_by)
       VALUES ($1,$2,$3,$4,$5,'draft',$6) RETURNING id`, [no, dto.warehouseId, dto.supplierName, dto.supplierCode, dto.expectedDate, userId]);
        for (const item of dto.items) {
            await this.ds.query(`INSERT INTO purchase_order_items (po_id, drug_id, quantity_order, unit, unit_price)
         VALUES ($1,$2,$3,$4,$5)`, [po.id, item.drugId, item.quantityOrder, item.unit, item.unitPrice]);
        }
        const total = dto.items.reduce((s, i) => s + (i.quantityOrder * (i.unitPrice || 0)), 0);
        await this.ds.query(`UPDATE purchase_orders SET total_amount=$1 WHERE id=$2`, [total, po.id]);
        return { poId: po.id, poNumber: no, message: 'PO berhasil dibuat' };
    }
    async getPOs(status, warehouseId) {
        let where = 'WHERE 1=1';
        const p = [];
        if (status) {
            p.push(status);
            where += ` AND po.status=$${p.length}`;
        }
        if (warehouseId) {
            p.push(warehouseId);
            where += ` AND po.warehouse_id=$${p.length}`;
        }
        return this.ds.query(`SELECT po.*, w.name AS warehouse_name,
              u_c.full_name AS created_by_name, u_a.full_name AS approved_by_name
       FROM purchase_orders po
       JOIN pharmacy_warehouses w ON w.id = po.warehouse_id
       LEFT JOIN users u_c ON u_c.id = po.created_by
       LEFT JOIN users u_a ON u_a.id = po.approved_by
       ${where} ORDER BY po.created_at DESC`, p);
    }
    async approvePO(poId, userId) {
        await this.ds.query(`UPDATE purchase_orders SET status='submitted', approved_by=$1 WHERE id=$2`, [userId, poId]);
        return { message: 'PO disetujui dan dikirim ke supplier' };
    }
    async receivePO(poId, dto, userId) {
        for (const item of dto.items) {
            const [poi] = await this.ds.query(`UPDATE purchase_order_items SET quantity_received=$1, batch_no=$2, expired_date=$3, unit_price=$4
         WHERE id=$5 RETURNING drug_id, quantity_received, unit, unit_price`, [item.quantityReceived, item.batchNo, item.expiredDate, item.unitPrice, item.poItemId]);
            if (!poi)
                continue;
            const [po] = await this.ds.query(`SELECT warehouse_id FROM purchase_orders WHERE id=$1`, [poId]);
            const [existing] = await this.ds.query(`SELECT id, quantity FROM drug_stocks WHERE warehouse_id=$1 AND drug_id=$2 AND batch_no=$3`, [po.warehouse_id, poi.drug_id, item.batchNo]);
            if (existing) {
                await this.ds.query(`UPDATE drug_stocks SET quantity=quantity+$1, updated_at=NOW() WHERE id=$2`, [item.quantityReceived, existing.id]);
            }
            else {
                await this.ds.query(`INSERT INTO drug_stocks (warehouse_id, drug_id, batch_no, expired_date, quantity, unit, unit_price)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`, [po.warehouse_id, poi.drug_id, item.batchNo, item.expiredDate,
                    item.quantityReceived, poi.unit, item.unitPrice || 0]);
            }
            await this.ds.query(`INSERT INTO stock_mutations
           (warehouse_id, drug_id, batch_no, mutation_type, quantity, unit_price,
            reference_id, reference_type, done_by, qty_before, qty_after)
         VALUES ($1,$2,$3,'in_purchase',$4,$5,$6,'purchase_orders',$7,$8,$9)`, [po.warehouse_id, poi.drug_id, item.batchNo, item.quantityReceived,
                item.unitPrice || 0, poId, userId,
                existing?.quantity || 0, (existing?.quantity || 0) + item.quantityReceived]);
        }
        await this.ds.query(`UPDATE purchase_orders SET status='received' WHERE id=$1`, [poId]);
        return { message: 'Penerimaan barang berhasil dicatat' };
    }
    async searchDrugs(q) {
        const page = q.page ?? 1;
        const limit = q.limit ?? 20;
        const offset = (page - 1) * limit;
        let where = 'WHERE d.is_active=true';
        const p = [];
        if (q.search) {
            p.push(`%${q.search}%`);
            where += ` AND (d.generic_name ILIKE $${p.length} OR d.brand_name ILIKE $${p.length} OR d.code ILIKE $${p.length})`;
        }
        if (q.drugClassCode) {
            p.push(q.drugClassCode);
            where += ` AND dc.code=$${p.length}`;
        }
        if (q.isFormularium !== undefined)
            where += ` AND d.is_formularium=${q.isFormularium}`;
        p.push(limit);
        p.push(offset);
        return this.ds.query(`SELECT d.id, d.code, d.generic_name, d.brand_name, d.drug_form,
              d.strength, d.unit, d.is_formularium, d.is_narcotic,
              dc.name AS drug_class, dc.requires_prescription
       FROM drugs d JOIN drug_classes dc ON dc.id = d.drug_class_id
       ${where} ORDER BY d.generic_name
       LIMIT $${p.length - 1} OFFSET $${p.length}`, p);
    }
    async getLowStockAlert(warehouseId) {
        let where = 'WHERE dr.is_active=true AND ds.quantity <= ds.reorder_level AND ds.reorder_level > 0';
        const p = [];
        if (warehouseId) {
            p.push(warehouseId);
            where += ` AND ds.warehouse_id=$${p.length}`;
        }
        return this.ds.query(`SELECT w.name AS warehouse_name, dr.code, dr.generic_name, dr.brand_name,
              ds.quantity AS current_qty, ds.reorder_level,
              ds.unit, ds.expired_date,
              CASE WHEN ds.quantity = 0 THEN 'HABIS' ELSE 'HAMPIR HABIS' END AS alert_level
       FROM drug_stocks ds
       JOIN pharmacy_warehouses w ON w.id = ds.warehouse_id
       JOIN drugs dr ON dr.id = ds.drug_id
       ${where} ORDER BY (ds.quantity::float/NULLIF(ds.reorder_level,0))`, p);
    }
    async getExpiringDrugs(daysAhead = 90, warehouseId) {
        let where = `WHERE ds.expired_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '${daysAhead} days'`;
        const p = [];
        if (warehouseId) {
            p.push(warehouseId);
            where += ` AND ds.warehouse_id=$${p.length}`;
        }
        return this.ds.query(`SELECT w.name AS warehouse_name, dr.generic_name, dr.brand_name,
              ds.batch_no, ds.expired_date, ds.quantity, ds.unit,
              (ds.expired_date - CURRENT_DATE) AS days_to_expire
       FROM drug_stocks ds
       JOIN pharmacy_warehouses w ON w.id = ds.warehouse_id
       JOIN drugs dr ON dr.id = ds.drug_id
       ${where} AND ds.quantity > 0
       ORDER BY ds.expired_date`, p);
    }
};
exports.PharmacyService = PharmacyService;
exports.PharmacyService = PharmacyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PharmacyService);
let PharmacyController = class PharmacyController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    pending() { return this.svc.getPendingRx(); }
    rxDetail(id) { return this.svc.getRxDetail(id); }
    dispense(dto, uid) { return this.svc.dispense(dto, uid); }
    stock(wh, s, ls) {
        return this.svc.getStock(wh, s, ls === 'true');
    }
    adjust(dto, uid) { return this.svc.adjustStock(dto, uid); }
    mutations(wh, d, s, e) {
        return this.svc.getStockMutations(wh, d, s, e);
    }
    lowStock(wh) { return this.svc.getLowStockAlert(wh); }
    expiring(d = 90, wh) { return this.svc.getExpiringDrugs(+d, wh); }
    createPO(dto, uid) { return this.svc.createPO(dto, uid); }
    getPOs(s, wh) { return this.svc.getPOs(s, wh); }
    approvePO(id, uid) { return this.svc.approvePO(id, uid); }
    receivePO(id, dto, uid) {
        return this.svc.receivePO(id, dto, uid);
    }
    drugs(q) { return this.svc.searchDrugs(q); }
};
exports.PharmacyController = PharmacyController;
__decorate([
    (0, common_2.Get)('prescriptions/pending'),
    (0, swagger_2.ApiOperation)({ summary: 'Antrian resep pending' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "pending", null);
__decorate([
    (0, common_2.Get)('prescriptions/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Detail resep + cek stok' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "rxDetail", null);
__decorate([
    (0, common_2.Post)('dispense'),
    (0, swagger_2.ApiOperation)({ summary: 'Dispensing resep' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DispenseDto, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "dispense", null);
__decorate([
    (0, common_2.Get)('stock'),
    (0, swagger_2.ApiOperation)({ summary: 'Lihat stok obat' }),
    __param(0, (0, common_2.Query)('warehouseId')),
    __param(1, (0, common_2.Query)('search')),
    __param(2, (0, common_2.Query)('lowStock')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "stock", null);
__decorate([
    (0, common_2.Post)('stock/adjust'),
    (0, swagger_2.ApiOperation)({ summary: 'Penyesuaian stok (opname)' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [StockAdjustmentDto, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "adjust", null);
__decorate([
    (0, common_2.Get)('stock/mutations'),
    (0, swagger_2.ApiOperation)({ summary: 'Riwayat mutasi stok' }),
    __param(0, (0, common_2.Query)('warehouseId')),
    __param(1, (0, common_2.Query)('drugId')),
    __param(2, (0, common_2.Query)('startDate')),
    __param(3, (0, common_2.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "mutations", null);
__decorate([
    (0, common_2.Get)('stock/alerts/low'),
    (0, swagger_2.ApiOperation)({ summary: 'Alert stok hampir habis' }),
    __param(0, (0, common_2.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "lowStock", null);
__decorate([
    (0, common_2.Get)('stock/alerts/expiring'),
    (0, swagger_2.ApiOperation)({ summary: 'Obat mendekati kadaluarsa' }),
    __param(0, (0, common_2.Query)('days')),
    __param(1, (0, common_2.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "expiring", null);
__decorate([
    (0, common_2.Post)('purchase-orders'),
    (0, swagger_2.ApiOperation)({ summary: 'Buat Purchase Order' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePoDto, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "createPO", null);
__decorate([
    (0, common_2.Get)('purchase-orders'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar PO' }),
    __param(0, (0, common_2.Query)('status')),
    __param(1, (0, common_2.Query)('warehouseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "getPOs", null);
__decorate([
    (0, common_2.Patch)('purchase-orders/:id/approve'),
    (0, swagger_2.ApiOperation)({ summary: 'Approve PO' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "approvePO", null);
__decorate([
    (0, common_2.Post)('purchase-orders/:id/receive'),
    (0, swagger_2.ApiOperation)({ summary: 'Terima barang dari PO' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReceivePoDto, String]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "receivePO", null);
__decorate([
    (0, common_2.Get)('drugs'),
    (0, swagger_2.ApiOperation)({ summary: 'Katalog obat formularium' }),
    __param(0, (0, common_2.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DrugSearchDto]),
    __metadata("design:returntype", void 0)
], PharmacyController.prototype, "drugs", null);
exports.PharmacyController = PharmacyController = __decorate([
    (0, swagger_2.ApiTags)('Pharmacy'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('pharmacy'),
    __metadata("design:paramtypes", [PharmacyService])
], PharmacyController);
let PharmacyModule = class PharmacyModule {
};
exports.PharmacyModule = PharmacyModule;
exports.PharmacyModule = PharmacyModule = __decorate([
    (0, common_3.Module)({
        controllers: [PharmacyController],
        providers: [PharmacyService],
        exports: [PharmacyService],
    })
], PharmacyModule);
//# sourceMappingURL=pharmacy.module.js.map