import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser, Roles } from '../../common/decorators';

// ── DTOs ──────────────────────────────────────────────────────────
export class CreateLeaveDto {
  @ApiProperty() @IsUUID() employeeId: string;
  @ApiProperty()
  @IsEnum(['annual', 'sick', 'emergency', 'maternity', 'paternity'])
  leaveType: string;
  @ApiProperty() @IsDateString() startDate: string;
  @ApiProperty() @IsDateString() endDate: string;
  @ApiPropertyOptional() @IsOptional() reason?: string;
}

export class RecordAttendanceDto {
  @ApiProperty() @IsUUID() employeeId: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() checkIn?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() checkOut?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() shiftId?: string;
  @ApiPropertyOptional() @IsOptional() status?: string;
  @ApiPropertyOptional() @IsOptional() leaveType?: string;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

export class RunPayrollDto {
  @ApiProperty() periodMonth: number;
  @ApiProperty() periodYear: number;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  employeeIds?: string[];
}

export class CreateAssetDto {
  @ApiProperty() @IsString() assetCode: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsUUID() categoryId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
  @ApiPropertyOptional() @IsOptional() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() purchaseDate?: string;
  @ApiProperty() @IsNumber() purchasePrice: number;
  @ApiPropertyOptional() @IsOptional() usefulLifeMonths?: number;
  @ApiPropertyOptional() @IsOptional() salvageValue?: number;
  @ApiPropertyOptional() @IsOptional() brand?: string;
  @ApiPropertyOptional() @IsOptional() model?: string;
  @ApiPropertyOptional() @IsOptional() serialNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() assetAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() deprAccountId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() accDeprAccountId?: string;
}

export class ScheduleMaintenanceDto {
  @ApiProperty() @IsUUID() assetId: string;
  @ApiProperty()
  @IsEnum(['preventive', 'corrective', 'calibration'])
  maintenanceType: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledDate?: string;
  @ApiPropertyOptional() @IsOptional() vendor?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() cost?: number;
  @ApiPropertyOptional() @IsOptional() description?: string;
}

export class InventoryMutationDto {
  @ApiProperty() @IsUUID() warehouseId: string;
  @ApiProperty() @IsUUID() itemId: string;
  @ApiProperty()
  @IsEnum([
    'in_purchase',
    'in_transfer',
    'out_use',
    'out_transfer',
    'adjustment',
  ])
  mutationType: string;
  @ApiProperty() @IsNumber() quantity: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() unitPrice?: number;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

// ── HR Service ────────────────────────────────────────────────────
@Injectable()
export class HrService {
  constructor(private ds: DataSource) {}

  async getEmployees(
    search?: string,
    departmentId?: string,
    isActive = true,
    page = 1,
    limit = 20,
  ) {
    const offset = (page - 1) * limit;
    let where = `WHERE e.is_active = ${isActive}`;
    const p: any[] = [];
    if (search) {
      p.push(`%${search}%`);
      where += ` AND e.full_name ILIKE $${p.length}`;
    }
    if (departmentId) {
      p.push(departmentId);
      where += ` AND ec.id IN (SELECT id FROM employment_contracts WHERE employee_id=e.id AND status='active' LIMIT 1)`;
    }
    p.push(limit);
    p.push(offset);
    return this.ds.query(
      `SELECT e.id, e.employee_number, e.full_name, e.gender, e.phone, e.email,
              e.join_date, e.employee_type, e.is_active,
              pos.name AS position_name, pos.grade,
              ec.basic_salary
       FROM employees e
       LEFT JOIN employment_contracts ec ON ec.employee_id = e.id AND ec.status = 'active'
       LEFT JOIN positions pos ON pos.id = ec.position_id
       ${where} ORDER BY e.full_name
       LIMIT $${p.length - 1} OFFSET $${p.length}`,
      p,
    );
  }

  async getEmployee(id: string) {
    const [emp] = await this.ds.query(
      `SELECT e.*, a.street, a.rt_rw, a.postal_code,
              r_vil.name AS village, r_dis.name AS district,
              pos.name AS position_name, ec.basic_salary, ec.contract_type,
              doc.id AS doctor_id, doc.title_prefix, doc.title_suffix,
              doc.license_number, doc.sip_number, doc.sip_expires_at, pos.department_id
       FROM employees e
       LEFT JOIN addresses a ON a.id = e.address_id
       LEFT JOIN regions r_vil ON r_vil.id = a.village_id
       LEFT JOIN regions r_dis ON r_dis.id = r_vil.parent_id
       LEFT JOIN employment_contracts ec ON ec.employee_id = e.id AND ec.status = 'active'
       LEFT JOIN positions pos ON pos.id = ec.position_id
       LEFT JOIN doctors doc ON doc.employee_id = e.id
       WHERE e.id = $1`,
      [id],
    );
    console.log('🚀 ~ HrService ~ getEmployee ~ emp:', emp);
    if (!emp) throw new NotFoundException('Pegawai tidak ditemukan');

    const salaryComponents = await this.ds.query(
      `SELECT esc.amount, sc.code, sc.name, sc.component_type
       FROM employee_salary_components esc
       JOIN salary_components sc ON sc.id = esc.component_id
       WHERE esc.employee_id = $1 AND esc.is_active = true
       ORDER BY sc.component_type, sc.name`,
      [id],
    );
    return { ...emp, salaryComponents };
  }

  // ── Attendance ────────────────────────────────────────────────
  async recordAttendance(dto: RecordAttendanceDto, userId: string) {
    const today = new Date().toISOString().split('T')[0];
    await this.ds.query(
      `INSERT INTO attendances
         (employee_id, attendance_date, shift_id, check_in, check_out, status,
          leave_type, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (employee_id, attendance_date) DO UPDATE SET
         check_in = COALESCE($4, attendances.check_in),
         check_out = COALESCE($5, attendances.check_out),
         status = COALESCE($6, attendances.status),
         notes = COALESCE($8, attendances.notes)`,
      [
        dto.employeeId,
        today,
        dto.shiftId,
        dto.checkIn,
        dto.checkOut,
        dto.status || 'present',
        dto.leaveType,
        dto.notes,
      ],
    );
    return { message: 'Absensi berhasil dicatat' };
  }

  async getAttendance(
    employeeId?: string,
    startDate?: string,
    endDate?: string,
    page = 1,
    limit = 31,
  ) {
    const offset = (page - 1) * limit;
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (employeeId) {
      p.push(employeeId);
      where += ` AND a.employee_id = $${p.length}`;
    }
    if (startDate) {
      p.push(startDate);
      where += ` AND a.attendance_date >= $${p.length}`;
    }
    if (endDate) {
      p.push(endDate);
      where += ` AND a.attendance_date <= $${p.length}`;
    }
    p.push(limit);
    p.push(offset);
    return this.ds.query(
      `SELECT a.*, e.full_name, e.employee_number,
              ws.name AS shift_name, ws.start_time, ws.end_time
       FROM attendances a
       JOIN employees e ON e.id = a.employee_id
       LEFT JOIN work_shifts ws ON ws.id = a.shift_id
       ${where} ORDER BY a.attendance_date DESC, e.full_name
       LIMIT $${p.length - 1} OFFSET $${p.length}`,
      p,
    );
  }

  async getAttendanceSummary(employeeId: string, month: number, year: number) {
    const [summary] = await this.ds.query(
      `SELECT
         COUNT(*) FILTER (WHERE status = 'present')  AS present_days,
         COUNT(*) FILTER (WHERE status = 'absent')   AS absent_days,
         COUNT(*) FILTER (WHERE status = 'sick')     AS sick_days,
         COUNT(*) FILTER (WHERE status = 'leave')    AS leave_days,
         SUM(late_minutes) AS total_late_minutes,
         SUM(overtime_minutes) AS total_overtime_minutes
       FROM attendances
       WHERE employee_id = $1
         AND EXTRACT(MONTH FROM attendance_date) = $2
         AND EXTRACT(YEAR  FROM attendance_date) = $3`,
      [employeeId, month, year],
    );
    return summary;
  }

  // ── Leave ─────────────────────────────────────────────────────
  async requestLeave(dto: CreateLeaveDto, userId: string) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 86400)) + 1;
    if (days <= 0) throw new BadRequestException('Tanggal tidak valid');

    const d = new Date();
    const [cnt] = await this.ds.query(
      `SELECT COUNT(*)+1 AS n FROM leave_requests`,
    );
    const no = `LV-${d.getFullYear()}-${String(cnt.n).padStart(5, '0')}`;

    const [row] = await this.ds.query(
      `INSERT INTO leave_requests (request_no, employee_id, leave_type, start_date, end_date, total_days, reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        no,
        dto.employeeId,
        dto.leaveType,
        dto.startDate,
        dto.endDate,
        days,
        dto.reason,
      ],
    );
    return row;
  }

  async processLeave(
    id: string,
    action: 'approved' | 'rejected',
    userId: string,
    reason?: string,
  ) {
    await this.ds.query(
      `UPDATE leave_requests SET status=$1, approved_by=$2, approved_at=NOW(),
         rejection_reason=$3 WHERE id=$4`,
      [action, userId, reason, id],
    );
    if (action === 'approved') {
      const [lr] = await this.ds.query(
        `SELECT * FROM leave_requests WHERE id=$1`,
        [id],
      );
      // Mark attendance as leave
      await this.ds.query(
        `INSERT INTO attendances (employee_id, attendance_date, status, leave_type, leave_doc_no)
         SELECT $1, d::date, 'leave', $2, $3
         FROM GENERATE_SERIES($4::date, $5::date, '1 day'::interval) d
         WHERE EXTRACT(DOW FROM d) NOT IN (0,6)
         ON CONFLICT (employee_id, attendance_date) DO UPDATE
           SET status='leave', leave_type=$2`,
        [
          lr.employee_id,
          lr.leave_type,
          lr.request_no,
          lr.start_date,
          lr.end_date,
        ],
      );
    }
    return {
      message: `Cuti ${action === 'approved' ? 'disetujui' : 'ditolak'}`,
    };
  }

  async getLeaveRequests(employeeId?: string, status?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (employeeId) {
      p.push(employeeId);
      where += ` AND lr.employee_id = $${p.length}`;
    }
    if (status) {
      p.push(status);
      where += ` AND lr.status = $${p.length}`;
    }
    return this.ds.query(
      `SELECT lr.*, e.full_name, e.employee_number,
              u.full_name AS approved_by_name
       FROM leave_requests lr
       JOIN employees e ON e.id = lr.employee_id
       LEFT JOIN users u ON u.id = lr.approved_by
       ${where} ORDER BY lr.created_at DESC`,
      p,
    );
  }

  // ── Payroll ───────────────────────────────────────────────────
  async runPayroll(dto: RunPayrollDto, userId: string) {
    const d = new Date();
    const [cnt] = await this.ds.query(
      `SELECT COUNT(*)+1 AS n FROM payroll_runs`,
    );
    const runNo = `PR-${dto.periodYear}${String(dto.periodMonth).padStart(2, '0')}-${String(cnt.n).padStart(3, '0')}`;

    const [run] = await this.ds.query(
      `INSERT INTO payroll_runs (run_no, period_month, period_year, run_date, status, created_by)
       VALUES ($1,$2,$3,CURRENT_DATE,'draft',$4) RETURNING id`,
      [runNo, dto.periodMonth, dto.periodYear, userId],
    );

    // Get employees
    let empWhere = `WHERE e.is_active = true`;
    const empP: any[] = [];
    if (dto.employeeIds?.length) {
      empP.push(dto.employeeIds);
      empWhere += ` AND e.id = ANY($1)`;
    }

    const employees = await this.ds.query(
      `SELECT e.id, ec.basic_salary, ec.position_id, ec.contract_type,
              pos.name AS position_name
       FROM employees e
       JOIN employment_contracts ec ON ec.employee_id = e.id AND ec.status = 'active'
       JOIN positions pos ON pos.id = ec.position_id
       ${empWhere}`,
      empP,
    );

    let totalGross = 0,
      totalDeduction = 0,
      totalNet = 0;

    for (const emp of employees) {
      // Attendance summary
      const [att] = await this.ds.query(
        `SELECT
           COUNT(*) FILTER (WHERE status = 'present') AS present_days,
           COUNT(*) FILTER (WHERE status = 'absent')  AS absent_days,
           SUM(overtime_minutes) AS overtime_minutes
         FROM attendances
         WHERE employee_id = $1
           AND EXTRACT(MONTH FROM attendance_date) = $2
           AND EXTRACT(YEAR  FROM attendance_date) = $3`,
        [emp.id, dto.periodMonth, dto.periodYear],
      );

      // Salary components
      const components = await this.ds.query(
        `SELECT esc.amount, sc.code, sc.name, sc.component_type, sc.is_taxable
         FROM employee_salary_components esc
         JOIN salary_components sc ON sc.id = esc.component_id
         WHERE esc.employee_id = $1 AND esc.is_active = true`,
        [emp.id],
      );

      const basicSalary = +emp.basic_salary;
      const allowances = components.filter(
        (c: any) => c.component_type === 'allowance',
      );
      const deductions = components.filter((c: any) =>
        ['deduction', 'tax', 'bpjs_kes', 'bpjs_tk'].includes(c.component_type),
      );
      const totalAllowance = allowances.reduce(
        (s: number, c: any) => s + +c.amount,
        0,
      );
      const totalDeductions = deductions.reduce(
        (s: number, c: any) => s + +c.amount,
        0,
      );
      // BPJS auto-calc (1% of basic for health, 2% for TK)
      const bpjsKes = basicSalary * 0.01;
      const bpjsTk = basicSalary * 0.02;
      const grossSalary = basicSalary + totalAllowance;
      const totalDed = totalDeductions + bpjsKes + bpjsTk;
      const netSalary = grossSalary - totalDed;

      const [slip] = await this.ds.query(
        `INSERT INTO payroll_slips
           (payroll_run_id, employee_id, position_id,
            work_days, present_days, absent_days, overtime_hours,
            basic_salary, total_allowance, total_deduction,
            gross_salary, tax_amount, net_salary)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,$12) RETURNING id`,
        [
          run.id,
          emp.id,
          emp.position_id,
          20,
          att?.present_days || 0,
          att?.absent_days || 0,
          Math.round((att?.overtime_minutes || 0) / 60),
          basicSalary,
          totalAllowance,
          totalDed,
          grossSalary,
          netSalary,
        ],
      );

      // Insert detail components
      for (const c of [...allowances, ...deductions]) {
        await this.ds.query(
          `INSERT INTO payroll_slip_details (payroll_slip_id, component_id, component_name, component_type, amount)
           SELECT $1, sc.id, $2, $3, $4 FROM salary_components sc WHERE sc.code = $5`,
          [slip.id, c.name, c.component_type, c.amount, c.code],
        );
      }

      totalGross += grossSalary;
      totalDeduction += totalDed;
      totalNet += netSalary;
    }

    await this.ds.query(
      `UPDATE payroll_runs SET
         status='calculated', total_gross=$1, total_deduction=$2,
         total_net=$3, total_employees=$4
       WHERE id=$5`,
      [totalGross, totalDeduction, totalNet, employees.length, run.id],
    );
    return {
      runId: run.id,
      runNo,
      totalEmployees: employees.length,
      totalGross,
      totalNet,
      message: 'Payroll berhasil dihitung',
    };
  }

  async getPayrollRuns(year?: number) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (year) {
      p.push(year);
      where += ` AND pr.period_year = $${p.length}`;
    }
    return this.ds.query(
      `SELECT pr.*, u.full_name AS created_by_name
       FROM payroll_runs pr LEFT JOIN users u ON u.id = pr.created_by
       ${where} ORDER BY pr.period_year DESC, pr.period_month DESC`,
      p,
    );
  }

  async getPayrollSlips(runId: string, employeeId?: string) {
    let where = `WHERE ps.payroll_run_id = $1`;
    const p: any[] = [runId];
    if (employeeId) {
      p.push(employeeId);
      where += ` AND ps.employee_id = $${p.length}`;
    }
    return this.ds.query(
      `SELECT ps.*, e.full_name, e.employee_number, pos.name AS position_name
       FROM payroll_slips ps
       JOIN employees e ON e.id = ps.employee_id
       LEFT JOIN positions pos ON pos.id = ps.position_id
       ${where} ORDER BY e.full_name`,
      p,
    );
  }

  async approvePayroll(runId: string, userId: string) {
    await this.ds.query(
      `UPDATE payroll_runs SET status='approved', approved_by=$1 WHERE id=$2 AND status='calculated'`,
      [userId, runId],
    );
    return { message: 'Payroll disetujui' };
  }
}

// ── Inventory & Asset Service ─────────────────────────────────────
@Injectable()
export class InventoryService {
  constructor(private ds: DataSource) {}

  async getStock(warehouseId?: string, search?: string) {
    let where = 'WHERE ii.is_active = true';
    const p: any[] = [];
    if (warehouseId) {
      p.push(warehouseId);
      where += ` AND is_wh.warehouse_id = $${p.length}`;
    }
    if (search) {
      p.push(`%${search}%`);
      where += ` AND ii.name ILIKE $${p.length}`;
    }
    return this.ds.query(
      `SELECT ii.code, ii.name, ii.unit, ic.name AS category,
              iw.name AS warehouse_name,
              COALESCE(is_wh.quantity, 0) AS quantity,
              is_wh.unit_price,
              CASE WHEN COALESCE(is_wh.quantity,0) <= ii.min_stock THEN true ELSE false END AS is_low
       FROM inventory_items ii
       JOIN inventory_categories ic ON ic.id = ii.category_id
       LEFT JOIN inventory_stocks is_wh ON is_wh.item_id = ii.id
       LEFT JOIN inventory_warehouses iw ON iw.id = is_wh.warehouse_id
       ${where} ORDER BY ic.name, ii.name`,
      p,
    );
  }

  async mutate(dto: InventoryMutationDto, userId: string) {
    const [existing] = await this.ds.query(
      `SELECT id, quantity FROM inventory_stocks WHERE warehouse_id=$1 AND item_id=$2`,
      [dto.warehouseId, dto.itemId],
    );
    const isIn = dto.mutationType.startsWith('in_');
    const before = existing?.quantity ?? 0;
    const after = isIn ? before + dto.quantity : before - dto.quantity;
    if (after < 0) throw new BadRequestException('Stok tidak bisa negatif');

    if (existing) {
      await this.ds.query(
        `UPDATE inventory_stocks SET quantity=$1, updated_at=NOW() WHERE id=$2`,
        [after, existing.id],
      );
    } else {
      await this.ds.query(
        `INSERT INTO inventory_stocks (warehouse_id, item_id, quantity, unit_price) VALUES ($1,$2,$3,$4)`,
        [dto.warehouseId, dto.itemId, after, dto.unitPrice || 0],
      );
    }
    await this.ds.query(
      `INSERT INTO inventory_mutations
         (warehouse_id, item_id, mutation_type, quantity, unit_price,
          done_by, qty_before, qty_after, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        dto.warehouseId,
        dto.itemId,
        dto.mutationType,
        dto.quantity,
        dto.unitPrice || 0,
        userId,
        before,
        after,
        dto.notes,
      ],
    );
    return { message: 'Mutasi inventory berhasil', before, after };
  }

  // ── Fixed Assets ──────────────────────────────────────────────
  async getAssets(status?: string, search?: string) {
    let where = "WHERE fa.status != 'disposed'";
    const p: any[] = [];
    if (status) {
      p.push(status);
      where += ` AND fa.status = $${p.length}`;
    }
    if (search) {
      p.push(`%${search}%`);
      where += ` AND (fa.name ILIKE $${p.length} OR fa.asset_code ILIKE $${p.length})`;
    }
    return this.ds.query(
      `SELECT fa.id, fa.asset_code, fa.name, fa.brand, fa.model, fa.serial_number,
              fa.purchase_date, fa.purchase_price, fa.accumulated_depr,
              fa.book_value, fa.status, fa.location, fa.condition,
              fa.useful_life_months, fa.depreciation_method,
              ic.name AS category_name, d.name AS department_name
       FROM fixed_assets fa
       JOIN inventory_categories ic ON ic.id = fa.category_id
       LEFT JOIN departments d ON d.id = fa.department_id
       ${where} ORDER BY fa.asset_code`,
      p,
    );
  }

  async createAsset(dto: CreateAssetDto, userId: string) {
    const existing = await this.ds.query(
      `SELECT id FROM fixed_assets WHERE asset_code=$1`,
      [dto.assetCode],
    );
    if (existing.length)
      throw new BadRequestException(
        `Kode aset ${dto.assetCode} sudah digunakan`,
      );

    const [row] = await this.ds.query(
      `INSERT INTO fixed_assets
         (asset_code, name, category_id, department_id, location,
          purchase_date, purchase_price, useful_life_months, salvage_value,
          brand, model, serial_number,
          asset_account_id, depr_account_id, acc_depr_account_id,
          status, book_value)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'active',$7)
       RETURNING *`,
      [
        dto.assetCode,
        dto.name,
        dto.categoryId,
        dto.departmentId,
        dto.location,
        dto.purchaseDate,
        dto.purchasePrice,
        dto.usefulLifeMonths || 60,
        dto.salvageValue || 0,
        dto.brand,
        dto.model,
        dto.serialNumber,
        dto.assetAccountId,
        dto.deprAccountId,
        dto.accDeprAccountId,
      ],
    );
    return row;
  }

  async calculateDepreciation(periodId: string, userId: string) {
    const assets = await this.ds.query(
      `SELECT fa.id, fa.purchase_price, fa.salvage_value, fa.accumulated_depr,
              fa.useful_life_months, fa.depreciation_method,
              fa.depr_account_id, fa.acc_depr_account_id
       FROM fixed_assets fa
       WHERE fa.status = 'active' AND fa.depr_account_id IS NOT NULL`,
    );

    const results: { assetId: string; deprAmount: number }[] = [];
    for (const asset of assets) {
      // Straight-line depreciation per bulan
      const monthlyDepr =
        (asset.purchase_price - asset.salvage_value) / asset.useful_life_months;
      const netBookValue = asset.purchase_price - asset.accumulated_depr;
      if (netBookValue <= asset.salvage_value) continue;

      const deprAmount = Math.min(
        monthlyDepr,
        netBookValue - asset.salvage_value,
      );

      await this.ds.query(
        `INSERT INTO asset_depreciations
           (asset_id, period_id, depreciation_amount,
            accumulated_before, accumulated_after)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (asset_id, period_id) DO NOTHING`,
        [
          asset.id,
          periodId,
          deprAmount,
          asset.accumulated_depr,
          asset.accumulated_depr + deprAmount,
        ],
      );

      await this.ds.query(
        `UPDATE fixed_assets SET accumulated_depr = accumulated_depr + $1,
           book_value = purchase_price - accumulated_depr - $1
         WHERE id = $2`,
        [deprAmount, asset.id],
      );

      results.push({ assetId: asset.id, deprAmount });
    }
    return {
      calculated: results.length,
      message: `Penyusutan ${results.length} aset dihitung`,
    };
  }

  async scheduleMaintenance(dto: ScheduleMaintenanceDto, userId: string) {
    const [row] = await this.ds.query(
      `INSERT INTO asset_maintenances
         (asset_id, maintenance_type, scheduled_date, vendor, cost, description, status)
       VALUES ($1,$2,$3,$4,$5,$6,'scheduled') RETURNING *`,
      [
        dto.assetId,
        dto.maintenanceType,
        dto.scheduledDate,
        dto.vendor,
        dto.cost,
        dto.description,
      ],
    );
    return row;
  }

  async completeMaintenance(
    id: string,
    body: { doneDate: string; cost?: number; description?: string },
    userId: string,
  ) {
    await this.ds.query(
      `UPDATE asset_maintenances SET status='completed', done_date=$1, cost=COALESCE($2,cost),
         description=COALESCE($3,description), done_by=$4 WHERE id=$5`,
      [body.doneDate, body.cost, body.description, userId, id],
    );
    return { message: 'Pemeliharaan selesai dicatat' };
  }

  async disposeAsset(assetId: string, reason: string) {
    await this.ds.query(
      `UPDATE fixed_assets SET status='disposed', notes=COALESCE(notes||' | ','')|| $1 WHERE id=$2`,
      [`Disposal: ${reason}`, assetId],
    );
    return { message: 'Aset berhasil di-dispose' };
  }
}

// ── Controllers ───────────────────────────────────────────────────
@ApiTags('HR')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrController {
  constructor(private readonly svc: HrService) {}

  @Get('employees')
  @ApiOperation({ summary: 'Daftar pegawai' })
  list(
    @Query('search') s?: string,
    @Query('departmentId') d?: string,
    @Query('page') p = 1,
    @Query('limit') l = 20,
  ) {
    return this.svc.getEmployees(s, d, true, +p, +l);
  }
  @Get('employees/:id')
  @ApiOperation({ summary: 'Detail pegawai' })
  detail(@Param('id') id: string) {
    return this.svc.getEmployee(id);
  }

  @Post('attendance')
  @ApiOperation({ summary: 'Catat absensi (check-in/out)' })
  recordAttendance(
    @Body() dto: RecordAttendanceDto,
    @CurrentUser('id') uid: string,
  ) {
    return this.svc.recordAttendance(dto, uid);
  }
  @Get('attendance')
  @ApiOperation({ summary: 'Daftar absensi' })
  getAttendance(
    @Query('employeeId') e?: string,
    @Query('startDate') s?: string,
    @Query('endDate') ed?: string,
    @Query('page') p = 1,
    @Query('limit') l = 31,
  ) {
    return this.svc.getAttendance(e, s, ed, +p, +l);
  }
  @Get('attendance/:empId/summary')
  @ApiOperation({ summary: 'Ringkasan kehadiran per bulan' })
  summary(
    @Param('empId') id: string,
    @Query('month') m: number,
    @Query('year') y: number,
  ) {
    return this.svc.getAttendanceSummary(id, +m, +y);
  }

  @Post('leaves')
  @ApiOperation({ summary: 'Ajukan cuti' })
  requestLeave(@Body() dto: CreateLeaveDto, @CurrentUser('id') uid: string) {
    return this.svc.requestLeave(dto, uid);
  }
  @Get('leaves')
  @ApiOperation({ summary: 'Daftar permohonan cuti' })
  getLeaves(@Query('employeeId') e?: string, @Query('status') s?: string) {
    return this.svc.getLeaveRequests(e, s);
  }
  @Patch('leaves/:id/approve')
  @ApiOperation({ summary: 'Setujui cuti' })
  @Roles('SUPERADMIN', 'ADMIN_RS', 'MANAJER')
  approveLeave(@Param('id') id: string, @CurrentUser('id') uid: string) {
    return this.svc.processLeave(id, 'approved', uid);
  }
  @Patch('leaves/:id/reject')
  @ApiOperation({ summary: 'Tolak cuti' })
  @Roles('SUPERADMIN', 'ADMIN_RS', 'MANAJER')
  rejectLeave(
    @Param('id') id: string,
    @Body('reason') r: string,
    @CurrentUser('id') uid: string,
  ) {
    return this.svc.processLeave(id, 'rejected', uid, r);
  }

  @Post('payroll/run')
  @ApiOperation({ summary: 'Hitung penggajian' })
  @Roles('SUPERADMIN', 'ADMIN_RS', 'KEUANGAN')
  runPayroll(@Body() dto: RunPayrollDto, @CurrentUser('id') uid: string) {
    return this.svc.runPayroll(dto, uid);
  }
  @Get('payroll/runs')
  @ApiOperation({ summary: 'Daftar payroll run' })
  payrollRuns(@Query('year') y?: number) {
    return this.svc.getPayrollRuns(y ? +y : undefined);
  }
  @Get('payroll/runs/:runId/slips')
  @ApiOperation({ summary: 'Slip gaji per run' })
  slips(@Param('runId') id: string, @Query('employeeId') e?: string) {
    return this.svc.getPayrollSlips(id, e);
  }
  @Patch('payroll/runs/:id/approve')
  @ApiOperation({ summary: 'Approve payroll' })
  @Roles('SUPERADMIN', 'MANAJER')
  approvePayroll(@Param('id') id: string, @CurrentUser('id') uid: string) {
    return this.svc.approvePayroll(id, uid);
  }
}

@ApiTags('Inventory & Assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly svc: InventoryService) {}

  @Get('stock')
  @ApiOperation({ summary: 'Stok inventory' })
  stock(@Query('warehouseId') w?: string, @Query('search') s?: string) {
    return this.svc.getStock(w, s);
  }
  @Post('mutations')
  @ApiOperation({ summary: 'Mutasi inventory (in/out)' })
  mutate(@Body() dto: InventoryMutationDto, @CurrentUser('id') uid: string) {
    return this.svc.mutate(dto, uid);
  }

  @Get('assets')
  @ApiOperation({ summary: 'Daftar aset tetap' })
  assets(@Query('status') s?: string, @Query('search') q?: string) {
    return this.svc.getAssets(s, q);
  }
  @Post('assets')
  @ApiOperation({ summary: 'Input aset tetap baru' })
  @Roles('SUPERADMIN', 'ADMIN_RS')
  createAsset(@Body() dto: CreateAssetDto, @CurrentUser('id') uid: string) {
    return this.svc.createAsset(dto, uid);
  }
  @Post('assets/depreciation')
  @ApiOperation({ summary: 'Hitung penyusutan aset untuk periode' })
  @Roles('SUPERADMIN', 'KEUANGAN')
  calcDepr(@Body('periodId') periodId: string, @CurrentUser('id') uid: string) {
    return this.svc.calculateDepreciation(periodId, uid);
  }
  @Post('assets/maintenance')
  @ApiOperation({ summary: 'Jadwalkan pemeliharaan aset' })
  scheduleMaint(
    @Body() dto: ScheduleMaintenanceDto,
    @CurrentUser('id') uid: string,
  ) {
    return this.svc.scheduleMaintenance(dto, uid);
  }
  @Patch('assets/maintenance/:id/complete')
  @ApiOperation({ summary: 'Selesaikan pemeliharaan' })
  completeMaint(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('id') uid: string,
  ) {
    return this.svc.completeMaintenance(id, body, uid);
  }
  @Patch('assets/:id/dispose')
  @ApiOperation({ summary: 'Dispose/hapus aset' })
  @Roles('SUPERADMIN', 'ADMIN_RS')
  dispose(@Param('id') id: string, @Body('reason') r: string) {
    return this.svc.disposeAsset(id, r);
  }
}

@Module({
  controllers: [HrController, InventoryController],
  providers: [HrService, InventoryService],
  exports: [HrService, InventoryService],
})
export class HrInventoryModule {}
