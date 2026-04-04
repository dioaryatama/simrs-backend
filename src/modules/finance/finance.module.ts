import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IsUUID, IsOptional, IsString, IsNumber, IsEnum, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Controller, Get, Post, Put, Patch, Body,
  Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser, Roles } from '../../common/decorators';

// ── DTOs ──────────────────────────────────────────────────────────
export class CreateJournalDto {
  @ApiProperty() @IsDateString() entryDate: string;
  @ApiPropertyOptional() @IsOptional() description?: string;
  @ApiProperty({ type: [Object] }) lines: JournalLineDto[];
}

export class JournalLineDto {
  @ApiProperty() @IsUUID() accountId: string;
  @ApiPropertyOptional() @IsOptional() debit?: number;
  @ApiPropertyOptional() @IsOptional() credit?: number;
  @ApiPropertyOptional() @IsOptional() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() costCenterId?: string;
}

export class PostJournalDto {
  @ApiProperty({ type: [String] }) @IsArray() @IsUUID('all', { each: true }) journalIds: string[];
}

export class BudgetDto {
  @ApiProperty() @IsUUID() fiscalYearId: string;
  @ApiProperty() @IsUUID() accountId: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() costCenterId?: string;
  @ApiProperty() @IsNumber() budgetAmount: number;
  @ApiPropertyOptional() @IsOptional() notes?: string;
}

// ── Service ───────────────────────────────────────────────────────
@Injectable()
export class FinanceService {
  constructor(private ds: DataSource) {}

  // ── CoA ───────────────────────────────────────────────────────
  async getAccounts(type?: string, isDetail?: boolean, search?: string) {
    let where = 'WHERE a.is_active = true';
    const p: any[] = [];
    if (type)     { p.push(type);     where += ` AND a.account_type = $${p.length}`; }
    if (isDetail !== undefined) where += ` AND a.is_detail = ${isDetail}`;
    if (search)   { p.push(`%${search}%`); where += ` AND (a.code ILIKE $${p.length} OR a.name ILIKE $${p.length})`; }
    return this.ds.query(
      `SELECT a.id, a.code, a.name, a.account_type, a.account_subtype,
              a.normal_balance, a.level, a.is_detail, a.currency,
              p.code AS parent_code, p.name AS parent_name
       FROM accounts a LEFT JOIN accounts p ON p.id = a.parent_id
       ${where} ORDER BY a.code`, p,
    );
  }

  async getAccountBalance(accountId: string, periodId?: string) {
    let where = `WHERE gl.account_id = $1`;
    const p: any[] = [accountId];
    if (periodId) { p.push(periodId); where += ` AND gl.period_id = $${p.length}`; }
    const [bal] = await this.ds.query(
      `SELECT a.code, a.name, a.account_type, a.normal_balance,
              COALESCE(SUM(gl.debit),0)  AS total_debit,
              COALESCE(SUM(gl.credit),0) AS total_credit,
              COALESCE(SUM(gl.debit),0) - COALESCE(SUM(gl.credit),0) AS net
       FROM accounts a LEFT JOIN general_ledger gl ON gl.account_id = a.id
       ${where}
       GROUP BY a.id, a.code, a.name, a.account_type, a.normal_balance`, p,
    );
    return bal;
  }

  // ── Fiscal Year & Period ──────────────────────────────────────
  async getFiscalYears() {
    return this.ds.query(
      `SELECT fy.*, COUNT(ap.id) AS period_count
       FROM fiscal_years fy LEFT JOIN accounting_periods ap ON ap.fiscal_year_id = fy.id
       GROUP BY fy.id ORDER BY fy.start_date DESC`,
    );
  }

  async getPeriods(fiscalYearId?: string) {
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (fiscalYearId) { p.push(fiscalYearId); where += ` AND ap.fiscal_year_id = $${p.length}`; }
    return this.ds.query(
      `SELECT ap.*, fy.name AS fiscal_year_name
       FROM accounting_periods ap JOIN fiscal_years fy ON fy.id = ap.fiscal_year_id
       ${where} ORDER BY ap.start_date`, p,
    );
  }

  async closePeriod(periodId: string, userId: string) {
    const [p] = await this.ds.query(`SELECT * FROM accounting_periods WHERE id = $1`, [periodId]);
    if (!p) throw new NotFoundException('Periode tidak ditemukan');
    if (p.status === 'locked') throw new BadRequestException('Periode sudah dikunci');
    await this.ds.query(
      `UPDATE accounting_periods SET status='closed', closed_by=$1, closed_at=NOW() WHERE id=$2`,
      [userId, periodId],
    );
    return { message: `Periode ${p.name} berhasil ditutup` };
  }

  // ── Journal Entries ───────────────────────────────────────────
  async createJournal(dto: CreateJournalDto, userId: string) {
    // Validasi balanced
    const totalD = dto.lines.reduce((s, l) => s + (l.debit  || 0), 0);
    const totalC = dto.lines.reduce((s, l) => s + (l.credit || 0), 0);
    if (Math.abs(totalD - totalC) > 0.01)
      throw new BadRequestException(`Jurnal tidak balance: Debit=${totalD}, Kredit=${totalC}`);

    // Cari periode aktif
    const [period] = await this.ds.query(
      `SELECT id FROM accounting_periods
       WHERE start_date <= $1 AND end_date >= $1 AND status = 'open'
       ORDER BY start_date LIMIT 1`, [dto.entryDate],
    );
    if (!period) throw new BadRequestException('Tidak ada periode akuntansi aktif untuk tanggal ini');

    const d = new Date();
    const prefix = `JE-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}-`;
    const [cnt] = await this.ds.query(
      `SELECT COUNT(*)+1 AS n FROM journal_entries WHERE journal_no LIKE '${prefix}%'`,
    );
    const jNo = prefix + String(cnt.n).padStart(5, '0');

    const [je] = await this.ds.query(
      `INSERT INTO journal_entries
         (journal_no, period_id, entry_date, entry_type, description,
          total_debit, total_credit, status, created_by)
       VALUES ($1,$2,$3,'manual',$4,$5,$6,'draft',$7) RETURNING id`,
      [jNo, period.id, dto.entryDate, dto.description, totalD, totalC, userId],
    );

    for (let i = 0; i < dto.lines.length; i++) {
      const l = dto.lines[i];
      await this.ds.query(
        `INSERT INTO journal_lines
           (journal_id, line_number, account_id, debit, credit, description, cost_center_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [je.id, i+1, l.accountId, l.debit||0, l.credit||0, l.description, l.costCenterId],
      );
    }
    return { journalId: je.id, journalNo: jNo, message: 'Jurnal berhasil dibuat' };
  }

  async getJournals(status?: string, startDate?: string, endDate?: string, page = 1, limit = 20) {
    const offset = (page-1)*limit;
    let where = 'WHERE 1=1';
    const p: any[] = [];
    if (status)    { p.push(status);    where += ` AND je.status = $${p.length}`; }
    if (startDate) { p.push(startDate); where += ` AND je.entry_date >= $${p.length}`; }
    if (endDate)   { p.push(endDate);   where += ` AND je.entry_date <= $${p.length}`; }
    p.push(limit); p.push(offset);
    return this.ds.query(
      `SELECT je.id, je.journal_no, je.entry_date, je.entry_type,
              je.description, je.total_debit, je.total_credit, je.status,
              ap.name AS period_name, u.full_name AS created_by_name
       FROM journal_entries je
       JOIN accounting_periods ap ON ap.id = je.period_id
       LEFT JOIN users u ON u.id = je.created_by
       ${where} ORDER BY je.entry_date DESC, je.journal_no
       LIMIT $${p.length-1} OFFSET $${p.length}`, p,
    );
  }

  async getJournalDetail(id: string) {
    const [je] = await this.ds.query(
      `SELECT je.*, ap.name AS period_name, u.full_name AS created_by_name
       FROM journal_entries je
       LEFT JOIN accounting_periods ap ON ap.id = je.period_id
       LEFT JOIN users u ON u.id = je.created_by
       WHERE je.id = $1`, [id],
    );
    if (!je) throw new NotFoundException('Jurnal tidak ditemukan');
    const lines = await this.ds.query(
      `SELECT jl.*, a.code AS account_code, a.name AS account_name,
              cc.name AS cost_center_name
       FROM journal_lines jl
       JOIN accounts a ON a.id = jl.account_id
       LEFT JOIN cost_centers cc ON cc.id = jl.cost_center_id
       WHERE jl.journal_id = $1 ORDER BY jl.line_number`, [id],
    );
    return { ...je, lines };
  }

  async postJournal(ids: string[], userId: string) {
    for (const id of ids) {
      const [je] = await this.ds.query(
        `SELECT id, period_id FROM journal_entries WHERE id = $1 AND status = 'draft'`, [id],
      );
      if (!je) continue;

      await this.ds.query(
        `UPDATE journal_entries SET status='posted', posted_by=$1, posted_at=NOW() WHERE id=$2`,
        [userId, id],
      );

      // Posting ke general ledger
      const lines = await this.ds.query(
        `SELECT jl.*, je.entry_date, je.period_id, je.description AS je_desc
         FROM journal_lines jl
         JOIN journal_entries je ON je.id = jl.journal_id
         WHERE jl.journal_id = $1`, [id],
      );

      for (const line of lines) {
        // Calculate running balance
        const [lastGl] = await this.ds.query(
          `SELECT balance FROM general_ledger
           WHERE account_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [line.account_id],
        );
        const prevBalance = lastGl?.balance ?? 0;
        const balance = prevBalance + line.debit - line.credit;

        await this.ds.query(
          `INSERT INTO general_ledger
             (account_id, period_id, journal_line_id, entry_date,
              description, debit, credit, balance, cost_center_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [line.account_id, line.period_id, line.id, line.entry_date,
           line.description || line.je_desc, line.debit, line.credit,
           balance, line.cost_center_id],
        );
      }
    }
    return { message: `${ids.length} jurnal berhasil diposting` };
  }

  async reverseJournal(id: string, userId: string) {
    const je = await this.getJournalDetail(id);
    if (je.status !== 'posted') throw new BadRequestException('Hanya jurnal yang sudah diposting yang bisa direverse');

    // Buat jurnal kebalikan
    const reversalLines = je.lines.map((l: any) => ({
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

    await this.ds.query(
      `UPDATE journal_entries SET status='reversed', reversed_by=$1, reversed_at=NOW(),
         reversal_je_id=$2 WHERE id=$3`,
      [userId, reversal.journalId, id],
    );
    return { ...reversal, message: 'Jurnal berhasil direverse' };
  }

  // ── Reports ───────────────────────────────────────────────────
  async getTrialBalance(periodId: string) {
    return this.ds.query(
      `SELECT a.code, a.name, a.account_type, a.normal_balance,
              COALESCE(SUM(gl.debit),0)  AS total_debit,
              COALESCE(SUM(gl.credit),0) AS total_credit,
              COALESCE(SUM(gl.debit),0) - COALESCE(SUM(gl.credit),0) AS net_balance
       FROM accounts a
       LEFT JOIN general_ledger gl ON gl.account_id = a.id AND gl.period_id = $1
       WHERE a.is_detail = true AND a.is_active = true
       GROUP BY a.id, a.code, a.name, a.account_type, a.normal_balance
       ORDER BY a.code`, [periodId],
    );
  }

  async getIncomeStatement(periodId: string) {
    const rows = await this.ds.query(
      `SELECT a.account_type, a.account_subtype, a.code, a.name,
              COALESCE(SUM(CASE WHEN a.normal_balance='C' THEN gl.credit - gl.debit
                               ELSE gl.debit - gl.credit END), 0) AS amount
       FROM accounts a
       LEFT JOIN general_ledger gl ON gl.account_id = a.id AND gl.period_id = $1
       WHERE a.account_type IN ('revenue','expense') AND a.is_detail = true
       GROUP BY a.id ORDER BY a.code`, [periodId],
    );
    const revenue  = rows.filter((r: any) => r.account_type === 'revenue').reduce((s: number, r: any) => s + +r.amount, 0);
    const expense  = rows.filter((r: any) => r.account_type === 'expense').reduce((s: number, r: any) => s + +r.amount, 0);
    return { items: rows, totalRevenue: revenue, totalExpense: expense, netIncome: revenue - expense };
  }

  async getBalanceSheet(periodId: string) {
    const rows = await this.ds.query(
      `SELECT a.account_type, a.account_subtype, a.code, a.name,
              COALESCE(SUM(gl.balance), 0) AS balance
       FROM accounts a
       LEFT JOIN (
         SELECT DISTINCT ON (account_id) account_id, balance
         FROM general_ledger WHERE period_id = $1
         ORDER BY account_id, created_at DESC
       ) gl ON gl.account_id = a.id
       WHERE a.account_type IN ('asset','liability','equity') AND a.is_detail = true
       GROUP BY a.id ORDER BY a.code`, [periodId],
    );
    const totalAsset     = rows.filter((r: any) => r.account_type === 'asset').reduce((s: number, r: any) => s + +r.balance, 0);
    const totalLiability = rows.filter((r: any) => r.account_type === 'liability').reduce((s: number, r: any) => s + +r.balance, 0);
    const totalEquity    = rows.filter((r: any) => r.account_type === 'equity').reduce((s: number, r: any) => s + +r.balance, 0);
    return { items: rows, totalAsset, totalLiability, totalEquity, balanced: Math.abs(totalAsset - totalLiability - totalEquity) < 1 };
  }

  async getArAging(payerId?: string) {
    let where = `WHERE i.outstanding_amount > 0 AND i.status NOT IN ('cancelled')`;
    const p: any[] = [];
    if (payerId) { p.push(payerId); where += ` AND ps.payer_id = $${p.length}`; }
    return this.ds.query(
      `SELECT py.name AS payer_name, py.payer_type,
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
       GROUP BY py.id, py.name, py.payer_type ORDER BY total_outstanding DESC`, p,
    );
  }

  // ── Budget ────────────────────────────────────────────────────
  async getBudgets(fiscalYearId: string) {
    return this.ds.query(
      `SELECT b.id, b.budget_amount, b.notes,
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
       WHERE b.fiscal_year_id = $1 ORDER BY a.code`, [fiscalYearId],
    );
  }

  async upsertBudget(dto: BudgetDto, userId: string) {
    await this.ds.query(
      `INSERT INTO budgets (fiscal_year_id, account_id, cost_center_id, budget_amount, notes, created_by)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (fiscal_year_id, account_id, cost_center_id)
       DO UPDATE SET budget_amount=$4, notes=$5`,
      [dto.fiscalYearId, dto.accountId, dto.costCenterId, dto.budgetAmount, dto.notes, userId],
    );
    return { message: 'Anggaran berhasil disimpan' };
  }

  // ── Cost Centers ──────────────────────────────────────────────
  async getCostCenters() {
    return this.ds.query(
      `SELECT cc.id, cc.code, cc.name, p.name AS parent_name, inst.name AS installation_name
       FROM cost_centers cc
       LEFT JOIN cost_centers p ON p.id = cc.parent_id
       LEFT JOIN installations inst ON inst.id = cc.installation_id
       WHERE cc.is_active = true ORDER BY cc.code`,
    );
  }
}

// ── Controller ────────────────────────────────────────────────────
@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly svc: FinanceService) {}

  // CoA
  @Get('accounts') @ApiOperation({ summary: 'Daftar Chart of Accounts' })
  accounts(@Query('type') t?: string, @Query('isDetail') d?: string, @Query('search') s?: string) {
    return this.svc.getAccounts(t, d !== undefined ? d === 'true' : undefined, s);
  }
  @Get('accounts/:id/balance') @ApiOperation({ summary: 'Saldo akun' })
  balance(@Param('id') id: string, @Query('periodId') p?: string) {
    return this.svc.getAccountBalance(id, p);
  }

  // Periods
  @Get('fiscal-years') @ApiOperation({ summary: 'Tahun fiskal' })
  fiscalYears() { return this.svc.getFiscalYears(); }
  @Get('periods') @ApiOperation({ summary: 'Periode akuntansi' })
  periods(@Query('fiscalYearId') fy?: string) { return this.svc.getPeriods(fy); }
  @Patch('periods/:id/close') @ApiOperation({ summary: 'Tutup periode akuntansi' })
  @Roles('SUPERADMIN', 'KEUANGAN')
  closePeriod(@Param('id') id: string, @CurrentUser('id') uid: string) {
    return this.svc.closePeriod(id, uid);
  }

  // Journals
  @Post('journals') @ApiOperation({ summary: 'Buat jurnal manual' })
  createJournal(@Body() dto: CreateJournalDto, @CurrentUser('id') uid: string) {
    return this.svc.createJournal(dto, uid);
  }
  @Get('journals') @ApiOperation({ summary: 'Daftar jurnal' })
  journals(@Query('status') s?: string, @Query('startDate') sd?: string,
    @Query('endDate') ed?: string, @Query('page') p = 1, @Query('limit') l = 20) {
    return this.svc.getJournals(s, sd, ed, +p, +l);
  }
  @Get('journals/:id') @ApiOperation({ summary: 'Detail jurnal + baris' })
  journalDetail(@Param('id') id: string) { return this.svc.getJournalDetail(id); }
  @Post('journals/post') @ApiOperation({ summary: 'Posting jurnal ke ledger' })
  @Roles('SUPERADMIN', 'KEUANGAN')
  postJournal(@Body() dto: PostJournalDto, @CurrentUser('id') uid: string) {
    return this.svc.postJournal(dto.journalIds, uid);
  }
  @Post('journals/:id/reverse') @ApiOperation({ summary: 'Reverse jurnal' })
  @Roles('SUPERADMIN', 'KEUANGAN')
  reverseJournal(@Param('id') id: string, @CurrentUser('id') uid: string) {
    return this.svc.reverseJournal(id, uid);
  }

  // Financial Reports
  @Get('reports/trial-balance') @ApiOperation({ summary: 'Neraca Saldo' })
  trialBalance(@Query('periodId') periodId: string) { return this.svc.getTrialBalance(periodId); }
  @Get('reports/income-statement') @ApiOperation({ summary: 'Laporan Laba Rugi' })
  incomeStatement(@Query('periodId') periodId: string) { return this.svc.getIncomeStatement(periodId); }
  @Get('reports/balance-sheet') @ApiOperation({ summary: 'Neraca' })
  balanceSheet(@Query('periodId') periodId: string) { return this.svc.getBalanceSheet(periodId); }
  @Get('reports/ar-aging') @ApiOperation({ summary: 'Aging Piutang' })
  arAging(@Query('payerId') p?: string) { return this.svc.getArAging(p); }

  // Budget
  @Get('budgets') @ApiOperation({ summary: 'Anggaran vs realisasi' })
  budgets(@Query('fiscalYearId') fy: string) { return this.svc.getBudgets(fy); }
  @Post('budgets') @ApiOperation({ summary: 'Simpan/update anggaran' })
  @Roles('SUPERADMIN', 'KEUANGAN', 'MANAJER')
  upsertBudget(@Body() dto: BudgetDto, @CurrentUser('id') uid: string) {
    return this.svc.upsertBudget(dto, uid);
  }

  // Cost Centers
  @Get('cost-centers') @ApiOperation({ summary: 'Daftar cost center' })
  costCenters() { return this.svc.getCostCenters(); }
}

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
