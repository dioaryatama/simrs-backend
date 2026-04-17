import { DataSource } from 'typeorm';
export declare class CreateJournalDto {
    entryDate: string;
    description?: string;
    lines: JournalLineDto[];
}
export declare class JournalLineDto {
    accountId: string;
    debit?: number;
    credit?: number;
    description?: string;
    costCenterId?: string;
}
export declare class PostJournalDto {
    journalIds: string[];
}
export declare class BudgetDto {
    fiscalYearId: string;
    accountId: string;
    costCenterId?: string;
    budgetAmount: number;
    notes?: string;
}
export declare class FinanceService {
    private ds;
    constructor(ds: DataSource);
    getAccounts(type?: string, isDetail?: boolean, search?: string): Promise<any>;
    getAccountBalance(accountId: string, periodId?: string): Promise<any>;
    getFiscalYears(): Promise<any>;
    getPeriods(fiscalYearId?: string): Promise<any>;
    closePeriod(periodId: string, userId: string): Promise<{
        message: string;
    }>;
    createJournal(dto: CreateJournalDto, userId: string): Promise<{
        journalId: any;
        journalNo: string;
        message: string;
    }>;
    getJournals(status?: string, startDate?: string, endDate?: string, page?: number, limit?: number): Promise<any>;
    getJournalDetail(id: string): Promise<any>;
    postJournal(ids: string[], userId: string): Promise<{
        message: string;
    }>;
    reverseJournal(id: string, userId: string): Promise<{
        message: string;
        journalId: any;
        journalNo: string;
    }>;
    getTrialBalance(periodId: string): Promise<any>;
    getIncomeStatement(periodId: string): Promise<{
        items: any;
        totalRevenue: any;
        totalExpense: any;
        netIncome: number;
    }>;
    getBalanceSheet(periodId: string): Promise<{
        items: any;
        totalAsset: any;
        totalLiability: any;
        totalEquity: any;
        balanced: boolean;
    }>;
    getArAging(payerId?: string): Promise<any>;
    getBudgets(fiscalYearId: string): Promise<any>;
    upsertBudget(dto: BudgetDto, userId: string): Promise<{
        message: string;
    }>;
    getCostCenters(): Promise<any>;
}
export declare class FinanceController {
    private readonly svc;
    constructor(svc: FinanceService);
    accounts(t?: string, d?: string, s?: string): Promise<any>;
    balance(id: string, p?: string): Promise<any>;
    fiscalYears(): Promise<any>;
    periods(fy?: string): Promise<any>;
    closePeriod(id: string, uid: string): Promise<{
        message: string;
    }>;
    createJournal(dto: CreateJournalDto, uid: string): Promise<{
        journalId: any;
        journalNo: string;
        message: string;
    }>;
    journals(s?: string, sd?: string, ed?: string, p?: number, l?: number): Promise<any>;
    journalDetail(id: string): Promise<any>;
    postJournal(dto: PostJournalDto, uid: string): Promise<{
        message: string;
    }>;
    reverseJournal(id: string, uid: string): Promise<{
        message: string;
        journalId: any;
        journalNo: string;
    }>;
    trialBalance(periodId: string): Promise<any>;
    incomeStatement(periodId: string): Promise<{
        items: any;
        totalRevenue: any;
        totalExpense: any;
        netIncome: number;
    }>;
    balanceSheet(periodId: string): Promise<{
        items: any;
        totalAsset: any;
        totalLiability: any;
        totalEquity: any;
        balanced: boolean;
    }>;
    arAging(p?: string): Promise<any>;
    budgets(fy: string): Promise<any>;
    upsertBudget(dto: BudgetDto, uid: string): Promise<{
        message: string;
    }>;
    costCenters(): Promise<any>;
}
export declare class FinanceModule {
}
