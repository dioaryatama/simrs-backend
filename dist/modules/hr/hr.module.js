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
exports.HrInventoryModule = exports.InventoryController = exports.HrController = exports.InventoryService = exports.HrService = exports.InventoryMutationDto = exports.ScheduleMaintenanceDto = exports.CreateAssetDto = exports.RunPayrollDto = exports.RecordAttendanceDto = exports.CreateLeaveDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const auth_guard_1 = require("../../common/guards/auth.guard");
const decorators_1 = require("../../common/decorators");
class CreateLeaveDto {
    employeeId;
    leaveType;
    startDate;
    endDate;
    reason;
}
exports.CreateLeaveDto = CreateLeaveDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(['annual', 'sick', 'emergency', 'maternity', 'paternity']),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "leaveType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLeaveDto.prototype, "reason", void 0);
class RecordAttendanceDto {
    employeeId;
    checkIn;
    checkOut;
    shiftId;
    status;
    leaveType;
    notes;
}
exports.RecordAttendanceDto = RecordAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "checkIn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "checkOut", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "shiftId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "leaveType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RecordAttendanceDto.prototype, "notes", void 0);
class RunPayrollDto {
    periodMonth;
    periodYear;
    employeeIds;
}
exports.RunPayrollDto = RunPayrollDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RunPayrollDto.prototype, "periodMonth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], RunPayrollDto.prototype, "periodYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], RunPayrollDto.prototype, "employeeIds", void 0);
class CreateAssetDto {
    assetCode;
    name;
    categoryId;
    departmentId;
    location;
    purchaseDate;
    purchasePrice;
    usefulLifeMonths;
    salvageValue;
    brand;
    model;
    serialNumber;
    assetAccountId;
    deprAccountId;
    accDeprAccountId;
}
exports.CreateAssetDto = CreateAssetDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "assetCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "departmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateAssetDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAssetDto.prototype, "usefulLifeMonths", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAssetDto.prototype, "salvageValue", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "brand", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "serialNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "assetAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "deprAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssetDto.prototype, "accDeprAccountId", void 0);
class ScheduleMaintenanceDto {
    assetId;
    maintenanceType;
    scheduledDate;
    vendor;
    cost;
    description;
}
exports.ScheduleMaintenanceDto = ScheduleMaintenanceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "assetId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)(['preventive', 'corrective', 'calibration']),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "maintenanceType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ScheduleMaintenanceDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ScheduleMaintenanceDto.prototype, "description", void 0);
class InventoryMutationDto {
    warehouseId;
    itemId;
    mutationType;
    quantity;
    unitPrice;
    notes;
}
exports.InventoryMutationDto = InventoryMutationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InventoryMutationDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], InventoryMutationDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsEnum)([
        'in_purchase',
        'in_transfer',
        'out_use',
        'out_transfer',
        'adjustment',
    ]),
    __metadata("design:type", String)
], InventoryMutationDto.prototype, "mutationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InventoryMutationDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InventoryMutationDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InventoryMutationDto.prototype, "notes", void 0);
let HrService = class HrService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    async getEmployees(search, departmentId, isActive = true, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        let where = `WHERE e.is_active = ${isActive}`;
        const p = [];
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
        return this.ds.query(`SELECT e.id, e.employee_number, e.full_name, e.gender, e.phone, e.email,
              e.join_date, e.employee_type, e.is_active,
              pos.name AS position_name, pos.grade,
              ec.basic_salary
       FROM employees e
       LEFT JOIN employment_contracts ec ON ec.employee_id = e.id AND ec.status = 'active'
       LEFT JOIN positions pos ON pos.id = ec.position_id
       ${where} ORDER BY e.full_name
       LIMIT $${p.length - 1} OFFSET $${p.length}`, p);
    }
    async getEmployee(id) {
        const [emp] = await this.ds.query(`SELECT e.*, a.street, a.rt_rw, a.postal_code,
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
       WHERE e.id = $1`, [id]);
        console.log('🚀 ~ HrService ~ getEmployee ~ emp:', emp);
        if (!emp)
            throw new common_1.NotFoundException('Pegawai tidak ditemukan');
        const salaryComponents = await this.ds.query(`SELECT esc.amount, sc.code, sc.name, sc.component_type
       FROM employee_salary_components esc
       JOIN salary_components sc ON sc.id = esc.component_id
       WHERE esc.employee_id = $1 AND esc.is_active = true
       ORDER BY sc.component_type, sc.name`, [id]);
        return { ...emp, salaryComponents };
    }
    async recordAttendance(dto, userId) {
        const today = new Date().toISOString().split('T')[0];
        await this.ds.query(`INSERT INTO attendances
         (employee_id, attendance_date, shift_id, check_in, check_out, status,
          leave_type, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (employee_id, attendance_date) DO UPDATE SET
         check_in = COALESCE($4, attendances.check_in),
         check_out = COALESCE($5, attendances.check_out),
         status = COALESCE($6, attendances.status),
         notes = COALESCE($8, attendances.notes)`, [
            dto.employeeId,
            today,
            dto.shiftId,
            dto.checkIn,
            dto.checkOut,
            dto.status || 'present',
            dto.leaveType,
            dto.notes,
        ]);
        return { message: 'Absensi berhasil dicatat' };
    }
    async getAttendance(employeeId, startDate, endDate, page = 1, limit = 31) {
        const offset = (page - 1) * limit;
        let where = 'WHERE 1=1';
        const p = [];
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
        return this.ds.query(`SELECT a.*, e.full_name, e.employee_number,
              ws.name AS shift_name, ws.start_time, ws.end_time
       FROM attendances a
       JOIN employees e ON e.id = a.employee_id
       LEFT JOIN work_shifts ws ON ws.id = a.shift_id
       ${where} ORDER BY a.attendance_date DESC, e.full_name
       LIMIT $${p.length - 1} OFFSET $${p.length}`, p);
    }
    async getAttendanceSummary(employeeId, month, year) {
        const [summary] = await this.ds.query(`SELECT
         COUNT(*) FILTER (WHERE status = 'present')  AS present_days,
         COUNT(*) FILTER (WHERE status = 'absent')   AS absent_days,
         COUNT(*) FILTER (WHERE status = 'sick')     AS sick_days,
         COUNT(*) FILTER (WHERE status = 'leave')    AS leave_days,
         SUM(late_minutes) AS total_late_minutes,
         SUM(overtime_minutes) AS total_overtime_minutes
       FROM attendances
       WHERE employee_id = $1
         AND EXTRACT(MONTH FROM attendance_date) = $2
         AND EXTRACT(YEAR  FROM attendance_date) = $3`, [employeeId, month, year]);
        return summary;
    }
    async requestLeave(dto, userId) {
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 86400)) + 1;
        if (days <= 0)
            throw new common_1.BadRequestException('Tanggal tidak valid');
        const d = new Date();
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM leave_requests`);
        const no = `LV-${d.getFullYear()}-${String(cnt.n).padStart(5, '0')}`;
        const [row] = await this.ds.query(`INSERT INTO leave_requests (request_no, employee_id, leave_type, start_date, end_date, total_days, reason)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [
            no,
            dto.employeeId,
            dto.leaveType,
            dto.startDate,
            dto.endDate,
            days,
            dto.reason,
        ]);
        return row;
    }
    async processLeave(id, action, userId, reason) {
        await this.ds.query(`UPDATE leave_requests SET status=$1, approved_by=$2, approved_at=NOW(),
         rejection_reason=$3 WHERE id=$4`, [action, userId, reason, id]);
        if (action === 'approved') {
            const [lr] = await this.ds.query(`SELECT * FROM leave_requests WHERE id=$1`, [id]);
            await this.ds.query(`INSERT INTO attendances (employee_id, attendance_date, status, leave_type, leave_doc_no)
         SELECT $1, d::date, 'leave', $2, $3
         FROM GENERATE_SERIES($4::date, $5::date, '1 day'::interval) d
         WHERE EXTRACT(DOW FROM d) NOT IN (0,6)
         ON CONFLICT (employee_id, attendance_date) DO UPDATE
           SET status='leave', leave_type=$2`, [
                lr.employee_id,
                lr.leave_type,
                lr.request_no,
                lr.start_date,
                lr.end_date,
            ]);
        }
        return {
            message: `Cuti ${action === 'approved' ? 'disetujui' : 'ditolak'}`,
        };
    }
    async getLeaveRequests(employeeId, status) {
        let where = 'WHERE 1=1';
        const p = [];
        if (employeeId) {
            p.push(employeeId);
            where += ` AND lr.employee_id = $${p.length}`;
        }
        if (status) {
            p.push(status);
            where += ` AND lr.status = $${p.length}`;
        }
        return this.ds.query(`SELECT lr.*, e.full_name, e.employee_number,
              u.full_name AS approved_by_name
       FROM leave_requests lr
       JOIN employees e ON e.id = lr.employee_id
       LEFT JOIN users u ON u.id = lr.approved_by
       ${where} ORDER BY lr.created_at DESC`, p);
    }
    async runPayroll(dto, userId) {
        const d = new Date();
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM payroll_runs`);
        const runNo = `PR-${dto.periodYear}${String(dto.periodMonth).padStart(2, '0')}-${String(cnt.n).padStart(3, '0')}`;
        const [run] = await this.ds.query(`INSERT INTO payroll_runs (run_no, period_month, period_year, run_date, status, created_by)
       VALUES ($1,$2,$3,CURRENT_DATE,'draft',$4) RETURNING id`, [runNo, dto.periodMonth, dto.periodYear, userId]);
        let empWhere = `WHERE e.is_active = true`;
        const empP = [];
        if (dto.employeeIds?.length) {
            empP.push(dto.employeeIds);
            empWhere += ` AND e.id = ANY($1)`;
        }
        const employees = await this.ds.query(`SELECT e.id, ec.basic_salary, ec.position_id, ec.contract_type,
              pos.name AS position_name
       FROM employees e
       JOIN employment_contracts ec ON ec.employee_id = e.id AND ec.status = 'active'
       JOIN positions pos ON pos.id = ec.position_id
       ${empWhere}`, empP);
        let totalGross = 0, totalDeduction = 0, totalNet = 0;
        for (const emp of employees) {
            const [att] = await this.ds.query(`SELECT
           COUNT(*) FILTER (WHERE status = 'present') AS present_days,
           COUNT(*) FILTER (WHERE status = 'absent')  AS absent_days,
           SUM(overtime_minutes) AS overtime_minutes
         FROM attendances
         WHERE employee_id = $1
           AND EXTRACT(MONTH FROM attendance_date) = $2
           AND EXTRACT(YEAR  FROM attendance_date) = $3`, [emp.id, dto.periodMonth, dto.periodYear]);
            const components = await this.ds.query(`SELECT esc.amount, sc.code, sc.name, sc.component_type, sc.is_taxable
         FROM employee_salary_components esc
         JOIN salary_components sc ON sc.id = esc.component_id
         WHERE esc.employee_id = $1 AND esc.is_active = true`, [emp.id]);
            const basicSalary = +emp.basic_salary;
            const allowances = components.filter((c) => c.component_type === 'allowance');
            const deductions = components.filter((c) => ['deduction', 'tax', 'bpjs_kes', 'bpjs_tk'].includes(c.component_type));
            const totalAllowance = allowances.reduce((s, c) => s + +c.amount, 0);
            const totalDeductions = deductions.reduce((s, c) => s + +c.amount, 0);
            const bpjsKes = basicSalary * 0.01;
            const bpjsTk = basicSalary * 0.02;
            const grossSalary = basicSalary + totalAllowance;
            const totalDed = totalDeductions + bpjsKes + bpjsTk;
            const netSalary = grossSalary - totalDed;
            const [slip] = await this.ds.query(`INSERT INTO payroll_slips
           (payroll_run_id, employee_id, position_id,
            work_days, present_days, absent_days, overtime_hours,
            basic_salary, total_allowance, total_deduction,
            gross_salary, tax_amount, net_salary)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,0,$12) RETURNING id`, [
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
            ]);
            for (const c of [...allowances, ...deductions]) {
                await this.ds.query(`INSERT INTO payroll_slip_details (payroll_slip_id, component_id, component_name, component_type, amount)
           SELECT $1, sc.id, $2, $3, $4 FROM salary_components sc WHERE sc.code = $5`, [slip.id, c.name, c.component_type, c.amount, c.code]);
            }
            totalGross += grossSalary;
            totalDeduction += totalDed;
            totalNet += netSalary;
        }
        await this.ds.query(`UPDATE payroll_runs SET
         status='calculated', total_gross=$1, total_deduction=$2,
         total_net=$3, total_employees=$4
       WHERE id=$5`, [totalGross, totalDeduction, totalNet, employees.length, run.id]);
        return {
            runId: run.id,
            runNo,
            totalEmployees: employees.length,
            totalGross,
            totalNet,
            message: 'Payroll berhasil dihitung',
        };
    }
    async getPayrollRuns(year) {
        let where = 'WHERE 1=1';
        const p = [];
        if (year) {
            p.push(year);
            where += ` AND pr.period_year = $${p.length}`;
        }
        return this.ds.query(`SELECT pr.*, u.full_name AS created_by_name
       FROM payroll_runs pr LEFT JOIN users u ON u.id = pr.created_by
       ${where} ORDER BY pr.period_year DESC, pr.period_month DESC`, p);
    }
    async getPayrollSlips(runId, employeeId) {
        let where = `WHERE ps.payroll_run_id = $1`;
        const p = [runId];
        if (employeeId) {
            p.push(employeeId);
            where += ` AND ps.employee_id = $${p.length}`;
        }
        return this.ds.query(`SELECT ps.*, e.full_name, e.employee_number, pos.name AS position_name
       FROM payroll_slips ps
       JOIN employees e ON e.id = ps.employee_id
       LEFT JOIN positions pos ON pos.id = ps.position_id
       ${where} ORDER BY e.full_name`, p);
    }
    async approvePayroll(runId, userId) {
        await this.ds.query(`UPDATE payroll_runs SET status='approved', approved_by=$1 WHERE id=$2 AND status='calculated'`, [userId, runId]);
        return { message: 'Payroll disetujui' };
    }
};
exports.HrService = HrService;
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], HrService);
let InventoryService = class InventoryService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    async getStock(warehouseId, search) {
        let where = 'WHERE ii.is_active = true';
        const p = [];
        if (warehouseId) {
            p.push(warehouseId);
            where += ` AND is_wh.warehouse_id = $${p.length}`;
        }
        if (search) {
            p.push(`%${search}%`);
            where += ` AND ii.name ILIKE $${p.length}`;
        }
        return this.ds.query(`SELECT ii.code, ii.name, ii.unit, ic.name AS category,
              iw.name AS warehouse_name,
              COALESCE(is_wh.quantity, 0) AS quantity,
              is_wh.unit_price,
              CASE WHEN COALESCE(is_wh.quantity,0) <= ii.min_stock THEN true ELSE false END AS is_low
       FROM inventory_items ii
       JOIN inventory_categories ic ON ic.id = ii.category_id
       LEFT JOIN inventory_stocks is_wh ON is_wh.item_id = ii.id
       LEFT JOIN inventory_warehouses iw ON iw.id = is_wh.warehouse_id
       ${where} ORDER BY ic.name, ii.name`, p);
    }
    async mutate(dto, userId) {
        const [existing] = await this.ds.query(`SELECT id, quantity FROM inventory_stocks WHERE warehouse_id=$1 AND item_id=$2`, [dto.warehouseId, dto.itemId]);
        const isIn = dto.mutationType.startsWith('in_');
        const before = existing?.quantity ?? 0;
        const after = isIn ? before + dto.quantity : before - dto.quantity;
        if (after < 0)
            throw new common_1.BadRequestException('Stok tidak bisa negatif');
        if (existing) {
            await this.ds.query(`UPDATE inventory_stocks SET quantity=$1, updated_at=NOW() WHERE id=$2`, [after, existing.id]);
        }
        else {
            await this.ds.query(`INSERT INTO inventory_stocks (warehouse_id, item_id, quantity, unit_price) VALUES ($1,$2,$3,$4)`, [dto.warehouseId, dto.itemId, after, dto.unitPrice || 0]);
        }
        await this.ds.query(`INSERT INTO inventory_mutations
         (warehouse_id, item_id, mutation_type, quantity, unit_price,
          done_by, qty_before, qty_after, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [
            dto.warehouseId,
            dto.itemId,
            dto.mutationType,
            dto.quantity,
            dto.unitPrice || 0,
            userId,
            before,
            after,
            dto.notes,
        ]);
        return { message: 'Mutasi inventory berhasil', before, after };
    }
    async getAssets(status, search) {
        let where = "WHERE fa.status != 'disposed'";
        const p = [];
        if (status) {
            p.push(status);
            where += ` AND fa.status = $${p.length}`;
        }
        if (search) {
            p.push(`%${search}%`);
            where += ` AND (fa.name ILIKE $${p.length} OR fa.asset_code ILIKE $${p.length})`;
        }
        return this.ds.query(`SELECT fa.id, fa.asset_code, fa.name, fa.brand, fa.model, fa.serial_number,
              fa.purchase_date, fa.purchase_price, fa.accumulated_depr,
              fa.book_value, fa.status, fa.location, fa.condition,
              fa.useful_life_months, fa.depreciation_method,
              ic.name AS category_name, d.name AS department_name
       FROM fixed_assets fa
       JOIN inventory_categories ic ON ic.id = fa.category_id
       LEFT JOIN departments d ON d.id = fa.department_id
       ${where} ORDER BY fa.asset_code`, p);
    }
    async createAsset(dto, userId) {
        const existing = await this.ds.query(`SELECT id FROM fixed_assets WHERE asset_code=$1`, [dto.assetCode]);
        if (existing.length)
            throw new common_1.BadRequestException(`Kode aset ${dto.assetCode} sudah digunakan`);
        const [row] = await this.ds.query(`INSERT INTO fixed_assets
         (asset_code, name, category_id, department_id, location,
          purchase_date, purchase_price, useful_life_months, salvage_value,
          brand, model, serial_number,
          asset_account_id, depr_account_id, acc_depr_account_id,
          status, book_value)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'active',$7)
       RETURNING *`, [
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
        ]);
        return row;
    }
    async calculateDepreciation(periodId, userId) {
        const assets = await this.ds.query(`SELECT fa.id, fa.purchase_price, fa.salvage_value, fa.accumulated_depr,
              fa.useful_life_months, fa.depreciation_method,
              fa.depr_account_id, fa.acc_depr_account_id
       FROM fixed_assets fa
       WHERE fa.status = 'active' AND fa.depr_account_id IS NOT NULL`);
        const results = [];
        for (const asset of assets) {
            const monthlyDepr = (asset.purchase_price - asset.salvage_value) / asset.useful_life_months;
            const netBookValue = asset.purchase_price - asset.accumulated_depr;
            if (netBookValue <= asset.salvage_value)
                continue;
            const deprAmount = Math.min(monthlyDepr, netBookValue - asset.salvage_value);
            await this.ds.query(`INSERT INTO asset_depreciations
           (asset_id, period_id, depreciation_amount,
            accumulated_before, accumulated_after)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (asset_id, period_id) DO NOTHING`, [
                asset.id,
                periodId,
                deprAmount,
                asset.accumulated_depr,
                asset.accumulated_depr + deprAmount,
            ]);
            await this.ds.query(`UPDATE fixed_assets SET accumulated_depr = accumulated_depr + $1,
           book_value = purchase_price - accumulated_depr - $1
         WHERE id = $2`, [deprAmount, asset.id]);
            results.push({ assetId: asset.id, deprAmount });
        }
        return {
            calculated: results.length,
            message: `Penyusutan ${results.length} aset dihitung`,
        };
    }
    async scheduleMaintenance(dto, userId) {
        const [row] = await this.ds.query(`INSERT INTO asset_maintenances
         (asset_id, maintenance_type, scheduled_date, vendor, cost, description, status)
       VALUES ($1,$2,$3,$4,$5,$6,'scheduled') RETURNING *`, [
            dto.assetId,
            dto.maintenanceType,
            dto.scheduledDate,
            dto.vendor,
            dto.cost,
            dto.description,
        ]);
        return row;
    }
    async completeMaintenance(id, body, userId) {
        await this.ds.query(`UPDATE asset_maintenances SET status='completed', done_date=$1, cost=COALESCE($2,cost),
         description=COALESCE($3,description), done_by=$4 WHERE id=$5`, [body.doneDate, body.cost, body.description, userId, id]);
        return { message: 'Pemeliharaan selesai dicatat' };
    }
    async disposeAsset(assetId, reason) {
        await this.ds.query(`UPDATE fixed_assets SET status='disposed', notes=COALESCE(notes||' | ','')|| $1 WHERE id=$2`, [`Disposal: ${reason}`, assetId]);
        return { message: 'Aset berhasil di-dispose' };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], InventoryService);
let HrController = class HrController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(s, d, p = 1, l = 20) {
        return this.svc.getEmployees(s, d, true, +p, +l);
    }
    detail(id) {
        return this.svc.getEmployee(id);
    }
    recordAttendance(dto, uid) {
        return this.svc.recordAttendance(dto, uid);
    }
    getAttendance(e, s, ed, p = 1, l = 31) {
        return this.svc.getAttendance(e, s, ed, +p, +l);
    }
    summary(id, m, y) {
        return this.svc.getAttendanceSummary(id, +m, +y);
    }
    requestLeave(dto, uid) {
        return this.svc.requestLeave(dto, uid);
    }
    getLeaves(e, s) {
        return this.svc.getLeaveRequests(e, s);
    }
    approveLeave(id, uid) {
        return this.svc.processLeave(id, 'approved', uid);
    }
    rejectLeave(id, r, uid) {
        return this.svc.processLeave(id, 'rejected', uid, r);
    }
    runPayroll(dto, uid) {
        return this.svc.runPayroll(dto, uid);
    }
    payrollRuns(y) {
        return this.svc.getPayrollRuns(y ? +y : undefined);
    }
    slips(id, e) {
        return this.svc.getPayrollSlips(id, e);
    }
    approvePayroll(id, uid) {
        return this.svc.approvePayroll(id, uid);
    }
};
exports.HrController = HrController;
__decorate([
    (0, common_2.Get)('employees'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar pegawai' }),
    __param(0, (0, common_2.Query)('search')),
    __param(1, (0, common_2.Query)('departmentId')),
    __param(2, (0, common_2.Query)('page')),
    __param(3, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "list", null);
__decorate([
    (0, common_2.Get)('employees/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Detail pegawai' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "detail", null);
__decorate([
    (0, common_2.Post)('attendance'),
    (0, swagger_2.ApiOperation)({ summary: 'Catat absensi (check-in/out)' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecordAttendanceDto, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "recordAttendance", null);
__decorate([
    (0, common_2.Get)('attendance'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar absensi' }),
    __param(0, (0, common_2.Query)('employeeId')),
    __param(1, (0, common_2.Query)('startDate')),
    __param(2, (0, common_2.Query)('endDate')),
    __param(3, (0, common_2.Query)('page')),
    __param(4, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getAttendance", null);
__decorate([
    (0, common_2.Get)('attendance/:empId/summary'),
    (0, swagger_2.ApiOperation)({ summary: 'Ringkasan kehadiran per bulan' }),
    __param(0, (0, common_2.Param)('empId')),
    __param(1, (0, common_2.Query)('month')),
    __param(2, (0, common_2.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "summary", null);
__decorate([
    (0, common_2.Post)('leaves'),
    (0, swagger_2.ApiOperation)({ summary: 'Ajukan cuti' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateLeaveDto, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "requestLeave", null);
__decorate([
    (0, common_2.Get)('leaves'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar permohonan cuti' }),
    __param(0, (0, common_2.Query)('employeeId')),
    __param(1, (0, common_2.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "getLeaves", null);
__decorate([
    (0, common_2.Patch)('leaves/:id/approve'),
    (0, swagger_2.ApiOperation)({ summary: 'Setujui cuti' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'ADMIN_RS', 'MANAJER'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "approveLeave", null);
__decorate([
    (0, common_2.Patch)('leaves/:id/reject'),
    (0, swagger_2.ApiOperation)({ summary: 'Tolak cuti' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'ADMIN_RS', 'MANAJER'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)('reason')),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "rejectLeave", null);
__decorate([
    (0, common_2.Post)('payroll/run'),
    (0, swagger_2.ApiOperation)({ summary: 'Hitung penggajian' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'ADMIN_RS', 'KEUANGAN'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RunPayrollDto, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "runPayroll", null);
__decorate([
    (0, common_2.Get)('payroll/runs'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar payroll run' }),
    __param(0, (0, common_2.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "payrollRuns", null);
__decorate([
    (0, common_2.Get)('payroll/runs/:runId/slips'),
    (0, swagger_2.ApiOperation)({ summary: 'Slip gaji per run' }),
    __param(0, (0, common_2.Param)('runId')),
    __param(1, (0, common_2.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "slips", null);
__decorate([
    (0, common_2.Patch)('payroll/runs/:id/approve'),
    (0, swagger_2.ApiOperation)({ summary: 'Approve payroll' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'MANAJER'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HrController.prototype, "approvePayroll", null);
exports.HrController = HrController = __decorate([
    (0, swagger_2.ApiTags)('HR'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('hr'),
    __metadata("design:paramtypes", [HrService])
], HrController);
let InventoryController = class InventoryController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    stock(w, s) {
        return this.svc.getStock(w, s);
    }
    mutate(dto, uid) {
        return this.svc.mutate(dto, uid);
    }
    assets(s, q) {
        return this.svc.getAssets(s, q);
    }
    createAsset(dto, uid) {
        return this.svc.createAsset(dto, uid);
    }
    calcDepr(periodId, uid) {
        return this.svc.calculateDepreciation(periodId, uid);
    }
    scheduleMaint(dto, uid) {
        return this.svc.scheduleMaintenance(dto, uid);
    }
    completeMaint(id, body, uid) {
        return this.svc.completeMaintenance(id, body, uid);
    }
    dispose(id, r) {
        return this.svc.disposeAsset(id, r);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_2.Get)('stock'),
    (0, swagger_2.ApiOperation)({ summary: 'Stok inventory' }),
    __param(0, (0, common_2.Query)('warehouseId')),
    __param(1, (0, common_2.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "stock", null);
__decorate([
    (0, common_2.Post)('mutations'),
    (0, swagger_2.ApiOperation)({ summary: 'Mutasi inventory (in/out)' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InventoryMutationDto, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "mutate", null);
__decorate([
    (0, common_2.Get)('assets'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar aset tetap' }),
    __param(0, (0, common_2.Query)('status')),
    __param(1, (0, common_2.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "assets", null);
__decorate([
    (0, common_2.Post)('assets'),
    (0, swagger_2.ApiOperation)({ summary: 'Input aset tetap baru' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'ADMIN_RS'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAssetDto, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "createAsset", null);
__decorate([
    (0, common_2.Post)('assets/depreciation'),
    (0, swagger_2.ApiOperation)({ summary: 'Hitung penyusutan aset untuk periode' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'KEUANGAN'),
    __param(0, (0, common_2.Body)('periodId')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "calcDepr", null);
__decorate([
    (0, common_2.Post)('assets/maintenance'),
    (0, swagger_2.ApiOperation)({ summary: 'Jadwalkan pemeliharaan aset' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ScheduleMaintenanceDto, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "scheduleMaint", null);
__decorate([
    (0, common_2.Patch)('assets/maintenance/:id/complete'),
    (0, swagger_2.ApiOperation)({ summary: 'Selesaikan pemeliharaan' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "completeMaint", null);
__decorate([
    (0, common_2.Patch)('assets/:id/dispose'),
    (0, swagger_2.ApiOperation)({ summary: 'Dispose/hapus aset' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'ADMIN_RS'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "dispose", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_2.ApiTags)('Inventory & Assets'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('inventory'),
    __metadata("design:paramtypes", [InventoryService])
], InventoryController);
let HrInventoryModule = class HrInventoryModule {
};
exports.HrInventoryModule = HrInventoryModule;
exports.HrInventoryModule = HrInventoryModule = __decorate([
    (0, common_3.Module)({
        controllers: [HrController, InventoryController],
        providers: [HrService, InventoryService],
        exports: [HrService, InventoryService],
    })
], HrInventoryModule);
//# sourceMappingURL=hr.module.js.map