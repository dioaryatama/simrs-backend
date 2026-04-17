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
exports.FinanceModule = exports.FinanceController = exports.FinanceService = exports.BudgetDto = exports.PostJournalDto = exports.JournalLineDto = exports.CreateJournalDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@nestjs/common");
const swagger_2 = require("@nestjs/swagger");
const common_3 = require("@nestjs/common");
const auth_guard_1 = require("../../common/guards/auth.guard");
const decorators_1 = require("../../common/decorators");
class CreateJournalDto {
    entryDate;
    description;
    lines;
}
exports.CreateJournalDto = CreateJournalDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "entryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJournalDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Object] }),
    __metadata("design:type", Array)
], CreateJournalDto.prototype, "lines", void 0);
class JournalLineDto {
    accountId;
    debit;
    credit;
    description;
    costCenterId;
}
exports.JournalLineDto = JournalLineDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], JournalLineDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], JournalLineDto.prototype, "debit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], JournalLineDto.prototype, "credit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], JournalLineDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], JournalLineDto.prototype, "costCenterId", void 0);
class PostJournalDto {
    journalIds;
}
exports.PostJournalDto = PostJournalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('all', { each: true }),
    __metadata("design:type", Array)
], PostJournalDto.prototype, "journalIds", void 0);
class BudgetDto {
    fiscalYearId;
    accountId;
    costCenterId;
    budgetAmount;
    notes;
}
exports.BudgetDto = BudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BudgetDto.prototype, "fiscalYearId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BudgetDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], BudgetDto.prototype, "costCenterId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], BudgetDto.prototype, "budgetAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BudgetDto.prototype, "notes", void 0);
let FinanceService = class FinanceService {
    ds;
    constructor(ds) {
        this.ds = ds;
    }
    async getAccounts(type, isDetail, search) {
        let where = 'WHERE a.is_active = true';
        const p = [];
        if (type) {
            p.push(type);
            where += ` AND a.account_type = $${p.length}`;
        }
        if (isDetail !== undefined)
            where += ` AND a.is_detail = ${isDetail}`;
        if (search) {
            p.push(`%${search}%`);
            where += ` AND (a.code ILIKE $${p.length} OR a.name ILIKE $${p.length})`;
        }
        return this.ds.query(`SELECT a.id, a.code, a.name, a.account_type, a.account_subtype,
              a.normal_balance, a.level, a.is_detail, a.currency,
              p.code AS parent_code, p.name AS parent_name
       FROM accounts a LEFT JOIN accounts p ON p.id = a.parent_id
       ${where} ORDER BY a.code`, p);
    }
    async getAccountBalance(accountId, periodId) {
        let where = `WHERE gl.account_id = $1`;
        const p = [accountId];
        if (periodId) {
            p.push(periodId);
            where += ` AND gl.period_id = $${p.length}`;
        }
        const [bal] = await this.ds.query(`SELECT a.code, a.name, a.account_type, a.normal_balance,
              COALESCE(SUM(gl.debit),0)  AS total_debit,
              COALESCE(SUM(gl.credit),0) AS total_credit,
              COALESCE(SUM(gl.debit),0) - COALESCE(SUM(gl.credit),0) AS net
       FROM accounts a LEFT JOIN general_ledger gl ON gl.account_id = a.id
       ${where}
       GROUP BY a.id, a.code, a.name, a.account_type, a.normal_balance`, p);
        return bal;
    }
    async getFiscalYears() {
        return this.ds.query(`SELECT fy.*, COUNT(ap.id) AS period_count
       FROM fiscal_years fy LEFT JOIN accounting_periods ap ON ap.fiscal_year_id = fy.id
       GROUP BY fy.id ORDER BY fy.start_date DESC`);
    }
    async getPeriods(fiscalYearId) {
        let where = 'WHERE 1=1';
        const p = [];
        if (fiscalYearId) {
            p.push(fiscalYearId);
            where += ` AND ap.fiscal_year_id = $${p.length}`;
        }
        return this.ds.query(`SELECT ap.*, fy.name AS fiscal_year_name
       FROM accounting_periods ap JOIN fiscal_years fy ON fy.id = ap.fiscal_year_id
       ${where} ORDER BY ap.start_date`, p);
    }
    async closePeriod(periodId, userId) {
        const [p] = await this.ds.query(`SELECT * FROM accounting_periods WHERE id = $1`, [periodId]);
        if (!p)
            throw new common_1.NotFoundException('Periode tidak ditemukan');
        if (p.status === 'locked')
            throw new common_1.BadRequestException('Periode sudah dikunci');
        await this.ds.query(`UPDATE accounting_periods SET status='closed', closed_by=$1, closed_at=NOW() WHERE id=$2`, [userId, periodId]);
        return { message: `Periode ${p.name} berhasil ditutup` };
    }
    async createJournal(dto, userId) {
        const totalD = dto.lines.reduce((s, l) => s + (l.debit || 0), 0);
        const totalC = dto.lines.reduce((s, l) => s + (l.credit || 0), 0);
        if (Math.abs(totalD - totalC) > 0.01)
            throw new common_1.BadRequestException(`Jurnal tidak balance: Debit=${totalD}, Kredit=${totalC}`);
        const [period] = await this.ds.query(`SELECT id FROM accounting_periods
       WHERE start_date <= $1 AND end_date >= $1 AND status = 'open'
       ORDER BY start_date LIMIT 1`, [dto.entryDate]);
        if (!period)
            throw new common_1.BadRequestException('Tidak ada periode akuntansi aktif untuk tanggal ini');
        const d = new Date();
        const prefix = `JE-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-`;
        const [cnt] = await this.ds.query(`SELECT COUNT(*)+1 AS n FROM journal_entries WHERE journal_no LIKE '${prefix}%'`);
        const jNo = prefix + String(cnt.n).padStart(5, '0');
        const [je] = await this.ds.query(`INSERT INTO journal_entries
         (journal_no, period_id, entry_date, entry_type, description,
          total_debit, total_credit, status, created_by)
       VALUES ($1,$2,$3,'manual',$4,$5,$6,'draft',$7) RETURNING id`, [jNo, period.id, dto.entryDate, dto.description, totalD, totalC, userId]);
        for (let i = 0; i < dto.lines.length; i++) {
            const l = dto.lines[i];
            await this.ds.query(`INSERT INTO journal_lines
           (journal_id, line_number, account_id, debit, credit, description, cost_center_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`, [je.id, i + 1, l.accountId, l.debit || 0, l.credit || 0, l.description, l.costCenterId]);
        }
        return { journalId: je.id, journalNo: jNo, message: 'Jurnal berhasil dibuat' };
    }
    async getJournals(status, startDate, endDate, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        let where = 'WHERE 1=1';
        const p = [];
        if (status) {
            p.push(status);
            where += ` AND je.status = $${p.length}`;
        }
        if (startDate) {
            p.push(startDate);
            where += ` AND je.entry_date >= $${p.length}`;
        }
        if (endDate) {
            p.push(endDate);
            where += ` AND je.entry_date <= $${p.length}`;
        }
        p.push(limit);
        p.push(offset);
        return this.ds.query(`SELECT je.id, je.journal_no, je.entry_date, je.entry_type,
              je.description, je.total_debit, je.total_credit, je.status,
              ap.name AS period_name, u.full_name AS created_by_name
       FROM journal_entries je
       JOIN accounting_periods ap ON ap.id = je.period_id
       LEFT JOIN users u ON u.id = je.created_by
       ${where} ORDER BY je.entry_date DESC, je.journal_no
       LIMIT $${p.length - 1} OFFSET $${p.length}`, p);
    }
    async getJournalDetail(id) {
        const [je] = await this.ds.query(`SELECT je.*, ap.name AS period_name, u.full_name AS created_by_name
       FROM journal_entries je
       LEFT JOIN accounting_periods ap ON ap.id = je.period_id
       LEFT JOIN users u ON u.id = je.created_by
       WHERE je.id = $1`, [id]);
        if (!je)
            throw new common_1.NotFoundException('Jurnal tidak ditemukan');
        const lines = await this.ds.query(`SELECT jl.*, a.code AS account_code, a.name AS account_name,
              cc.name AS cost_center_name
       FROM journal_lines jl
       JOIN accounts a ON a.id = jl.account_id
       LEFT JOIN cost_centers cc ON cc.id = jl.cost_center_id
       WHERE jl.journal_id = $1 ORDER BY jl.line_number`, [id]);
        return { ...je, lines };
    }
    async postJournal(ids, userId) {
        for (const id of ids) {
            const [je] = await this.ds.query(`SELECT id, period_id FROM journal_entries WHERE id = $1 AND status = 'draft'`, [id]);
            if (!je)
                continue;
            await this.ds.query(`UPDATE journal_entries SET status='posted', posted_by=$1, posted_at=NOW() WHERE id=$2`, [userId, id]);
            const lines = await this.ds.query(`SELECT jl.*, je.entry_date, je.period_id, je.description AS je_desc
         FROM journal_lines jl
         JOIN journal_entries je ON je.id = jl.journal_id
         WHERE jl.journal_id = $1`, [id]);
            for (const line of lines) {
                const [lastGl] = await this.ds.query(`SELECT balance FROM general_ledger
           WHERE account_id = $1 ORDER BY created_at DESC LIMIT 1`, [line.account_id]);
                const prevBalance = lastGl?.balance ?? 0;
                const balance = prevBalance + line.debit - line.credit;
                await this.ds.query(`INSERT INTO general_ledger
             (account_id, period_id, journal_line_id, entry_date,
              description, debit, credit, balance, cost_center_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [line.account_id, line.period_id, line.id, line.entry_date,
                    line.description || line.je_desc, line.debit, line.credit,
                    balance, line.cost_center_id]);
            }
        }
        return { message: `${ids.length} jurnal berhasil diposting` };
    }
    async reverseJournal(id, userId) {
        const je = await this.getJournalDetail(id);
        if (je.status !== 'posted')
            throw new common_1.BadRequestException('Hanya jurnal yang sudah diposting yang bisa direverse');
        const reversalLines = je.lines.map((l) => ({
            accountId: l.account_id,
            debit: l.credit,
            credit: l.debit,
            description: `Reversal: ${l.description || ''}`,
            costCenterId: l.cost_center_id,
        }));
        const reversal = await this.createJournal({
            entryDate: new Date().toISOString().split('T')[0],
            description: `Reversal of ${je.journal_no}`,
            lines: reversalLines,
        }, userId);
        await this.ds.query(`UPDATE journal_entries SET status='reversed', reversed_by=$1, reversed_at=NOW(),
         reversal_je_id=$2 WHERE id=$3`, [userId, reversal.journalId, id]);
        return { ...reversal, message: 'Jurnal berhasil direverse' };
    }
    async getTrialBalance(periodId) {
        return this.ds.query(`SELECT a.code, a.name, a.account_type, a.normal_balance,
              COALESCE(SUM(gl.debit),0)  AS total_debit,
              COALESCE(SUM(gl.credit),0) AS total_credit,
              COALESCE(SUM(gl.debit),0) - COALESCE(SUM(gl.credit),0) AS net_balance
       FROM accounts a
       LEFT JOIN general_ledger gl ON gl.account_id = a.id AND gl.period_id = $1
       WHERE a.is_detail = true AND a.is_active = true
       GROUP BY a.id, a.code, a.name, a.account_type, a.normal_balance
       ORDER BY a.code`, [periodId]);
    }
    async getIncomeStatement(periodId) {
        const rows = await this.ds.query(`SELECT a.account_type, a.account_subtype, a.code, a.name,
              COALESCE(SUM(CASE WHEN a.normal_balance='C' THEN gl.credit - gl.debit
                               ELSE gl.debit - gl.credit END), 0) AS amount
       FROM accounts a
       LEFT JOIN general_ledger gl ON gl.account_id = a.id AND gl.period_id = $1
       WHERE a.account_type IN ('revenue','expense') AND a.is_detail = true
       GROUP BY a.id ORDER BY a.code`, [periodId]);
        const revenue = rows.filter((r) => r.account_type === 'revenue').reduce((s, r) => s + +r.amount, 0);
        const expense = rows.filter((r) => r.account_type === 'expense').reduce((s, r) => s + +r.amount, 0);
        return { items: rows, totalRevenue: revenue, totalExpense: expense, netIncome: revenue - expense };
    }
    async getBalanceSheet(periodId) {
        const rows = await this.ds.query(`SELECT a.account_type, a.account_subtype, a.code, a.name,
              COALESCE(SUM(gl.balance), 0) AS balance
       FROM accounts a
       LEFT JOIN (
         SELECT DISTINCT ON (account_id) account_id, balance
         FROM general_ledger WHERE period_id = $1
         ORDER BY account_id, created_at DESC
       ) gl ON gl.account_id = a.id
       WHERE a.account_type IN ('asset','liability','equity') AND a.is_detail = true
       GROUP BY a.id ORDER BY a.code`, [periodId]);
        const totalAsset = rows.filter((r) => r.account_type === 'asset').reduce((s, r) => s + +r.balance, 0);
        const totalLiability = rows.filter((r) => r.account_type === 'liability').reduce((s, r) => s + +r.balance, 0);
        const totalEquity = rows.filter((r) => r.account_type === 'equity').reduce((s, r) => s + +r.balance, 0);
        return { items: rows, totalAsset, totalLiability, totalEquity, balanced: Math.abs(totalAsset - totalLiability - totalEquity) < 1 };
    }
    async getArAging(payerId) {
        let where = `WHERE i.outstanding_amount > 0 AND i.status NOT IN ('cancelled')`;
        const p = [];
        if (payerId) {
            p.push(payerId);
            where += ` AND ps.payer_id = $${p.length}`;
        }
        return this.ds.query(`SELECT py.name AS payer_name, py.payer_type,
              COUNT(i.id) AS invoice_count,
              SUM(i.outstanding_amount) AS total_outstanding,
              SUM(i.outstanding_amount) FILTER (WHERE ar.aging_bucket='current') AS current_amount,
              SUM(i.outstanding_amount) FILTER (WHERE ar.aging_bucket='1-30')    AS days_1_30,
              SUM(i.outstanding_amount) FILTER (WHERE ar.aging_bucket='31-60')   AS days_31_60,
              SUM(i.outstanding_amount) FILTER (WHERE ar.aging_bucket='61-90')   AS days_61_90,
              SUM(i.outstanding_amount) FILTER (WHERE ar.aging_bucket='>90')     AS days_over_90
       FROM invoices i
       JOIN payment_schemes ps ON ps.id = i.payment_scheme_id
       LEFT JOIN payers py ON py.id = ps.payer_id
       LEFT JOIN ar_aging ar ON ar.invoice_id = i.id
       ${where}
       GROUP BY py.id, py.name, py.payer_type ORDER BY total_outstanding DESC`, p);
    }
    async getBudgets(fiscalYearId) {
        return this.ds.query(`SELECT b.id, b.budget_amount, b.notes,
              a.code AS account_code, a.name AS account_name, a.account_type,
              cc.name AS cost_center_name, fy.name AS fiscal_year_name,
              COALESCE((
                SELECT SUM(gl.debit - gl.credit)
                FROM general_ledger gl
                JOIN accounting_periods ap ON ap.id = gl.period_id
                WHERE gl.account_id = b.account_id AND ap.fiscal_year_id = b.fiscal_year_id
              ), 0) AS actual_amount,
              b.budget_amount - COALESCE((
                SELECT SUM(gl.debit - gl.credit)
                FROM general_ledger gl
                JOIN accounting_periods ap ON ap.id = gl.period_id
                WHERE gl.account_id = b.account_id AND ap.fiscal_year_id = b.fiscal_year_id
              ), 0) AS variance
       FROM budgets b
       JOIN accounts a ON a.id = b.account_id
       JOIN fiscal_years fy ON fy.id = b.fiscal_year_id
       LEFT JOIN cost_centers cc ON cc.id = b.cost_center_id
       WHERE b.fiscal_year_id = $1 ORDER BY a.code`, [fiscalYearId]);
    }
    async upsertBudget(dto, userId) {
        await this.ds.query(`INSERT INTO budgets (fiscal_year_id, account_id, cost_center_id, budget_amount, notes, created_by)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (fiscal_year_id, account_id, cost_center_id)
       DO UPDATE SET budget_amount=$4, notes=$5`, [dto.fiscalYearId, dto.accountId, dto.costCenterId, dto.budgetAmount, dto.notes, userId]);
        return { message: 'Anggaran berhasil disimpan' };
    }
    async getCostCenters() {
        return this.ds.query(`SELECT cc.id, cc.code, cc.name, p.name AS parent_name, inst.name AS installation_name
       FROM cost_centers cc
       LEFT JOIN cost_centers p ON p.id = cc.parent_id
       LEFT JOIN installations inst ON inst.id = cc.installation_id
       WHERE cc.is_active = true ORDER BY cc.code`);
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], FinanceService);
let FinanceController = class FinanceController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    accounts(t, d, s) {
        return this.svc.getAccounts(t, d !== undefined ? d === 'true' : undefined, s);
    }
    balance(id, p) {
        return this.svc.getAccountBalance(id, p);
    }
    fiscalYears() { return this.svc.getFiscalYears(); }
    periods(fy) { return this.svc.getPeriods(fy); }
    closePeriod(id, uid) {
        return this.svc.closePeriod(id, uid);
    }
    createJournal(dto, uid) {
        return this.svc.createJournal(dto, uid);
    }
    journals(s, sd, ed, p = 1, l = 20) {
        return this.svc.getJournals(s, sd, ed, +p, +l);
    }
    journalDetail(id) { return this.svc.getJournalDetail(id); }
    postJournal(dto, uid) {
        return this.svc.postJournal(dto.journalIds, uid);
    }
    reverseJournal(id, uid) {
        return this.svc.reverseJournal(id, uid);
    }
    trialBalance(periodId) { return this.svc.getTrialBalance(periodId); }
    incomeStatement(periodId) { return this.svc.getIncomeStatement(periodId); }
    balanceSheet(periodId) { return this.svc.getBalanceSheet(periodId); }
    arAging(p) { return this.svc.getArAging(p); }
    budgets(fy) { return this.svc.getBudgets(fy); }
    upsertBudget(dto, uid) {
        return this.svc.upsertBudget(dto, uid);
    }
    costCenters() { return this.svc.getCostCenters(); }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_2.Get)('accounts'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar Chart of Accounts' }),
    __param(0, (0, common_2.Query)('type')),
    __param(1, (0, common_2.Query)('isDetail')),
    __param(2, (0, common_2.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "accounts", null);
__decorate([
    (0, common_2.Get)('accounts/:id/balance'),
    (0, swagger_2.ApiOperation)({ summary: 'Saldo akun' }),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "balance", null);
__decorate([
    (0, common_2.Get)('fiscal-years'),
    (0, swagger_2.ApiOperation)({ summary: 'Tahun fiskal' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "fiscalYears", null);
__decorate([
    (0, common_2.Get)('periods'),
    (0, swagger_2.ApiOperation)({ summary: 'Periode akuntansi' }),
    __param(0, (0, common_2.Query)('fiscalYearId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "periods", null);
__decorate([
    (0, common_2.Patch)('periods/:id/close'),
    (0, swagger_2.ApiOperation)({ summary: 'Tutup periode akuntansi' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'KEUANGAN'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "closePeriod", null);
__decorate([
    (0, common_2.Post)('journals'),
    (0, swagger_2.ApiOperation)({ summary: 'Buat jurnal manual' }),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateJournalDto, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createJournal", null);
__decorate([
    (0, common_2.Get)('journals'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar jurnal' }),
    __param(0, (0, common_2.Query)('status')),
    __param(1, (0, common_2.Query)('startDate')),
    __param(2, (0, common_2.Query)('endDate')),
    __param(3, (0, common_2.Query)('page')),
    __param(4, (0, common_2.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "journals", null);
__decorate([
    (0, common_2.Get)('journals/:id'),
    (0, swagger_2.ApiOperation)({ summary: 'Detail jurnal + baris' }),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "journalDetail", null);
__decorate([
    (0, common_2.Post)('journals/post'),
    (0, swagger_2.ApiOperation)({ summary: 'Posting jurnal ke ledger' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'KEUANGAN'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostJournalDto, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "postJournal", null);
__decorate([
    (0, common_2.Post)('journals/:id/reverse'),
    (0, swagger_2.ApiOperation)({ summary: 'Reverse jurnal' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'KEUANGAN'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "reverseJournal", null);
__decorate([
    (0, common_2.Get)('reports/trial-balance'),
    (0, swagger_2.ApiOperation)({ summary: 'Neraca Saldo' }),
    __param(0, (0, common_2.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "trialBalance", null);
__decorate([
    (0, common_2.Get)('reports/income-statement'),
    (0, swagger_2.ApiOperation)({ summary: 'Laporan Laba Rugi' }),
    __param(0, (0, common_2.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "incomeStatement", null);
__decorate([
    (0, common_2.Get)('reports/balance-sheet'),
    (0, swagger_2.ApiOperation)({ summary: 'Neraca' }),
    __param(0, (0, common_2.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "balanceSheet", null);
__decorate([
    (0, common_2.Get)('reports/ar-aging'),
    (0, swagger_2.ApiOperation)({ summary: 'Aging Piutang' }),
    __param(0, (0, common_2.Query)('payerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "arAging", null);
__decorate([
    (0, common_2.Get)('budgets'),
    (0, swagger_2.ApiOperation)({ summary: 'Anggaran vs realisasi' }),
    __param(0, (0, common_2.Query)('fiscalYearId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "budgets", null);
__decorate([
    (0, common_2.Post)('budgets'),
    (0, swagger_2.ApiOperation)({ summary: 'Simpan/update anggaran' }),
    (0, decorators_1.Roles)('SUPERADMIN', 'KEUANGAN', 'MANAJER'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BudgetDto, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "upsertBudget", null);
__decorate([
    (0, common_2.Get)('cost-centers'),
    (0, swagger_2.ApiOperation)({ summary: 'Daftar cost center' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "costCenters", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_2.ApiTags)('Finance'),
    (0, swagger_2.ApiBearerAuth)(),
    (0, common_2.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('finance'),
    __metadata("design:paramtypes", [FinanceService])
], FinanceController);
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_3.Module)({
        controllers: [FinanceController],
        providers: [FinanceService],
        exports: [FinanceService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map