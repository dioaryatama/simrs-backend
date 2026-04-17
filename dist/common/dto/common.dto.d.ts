export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    get skip(): number;
}
export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta;
    timestamp: string;
    constructor(data: T, message?: string, meta?: PaginationMeta);
}
export declare class PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    constructor(page: number, limit: number, total: number);
}
export declare class ApiErrorResponse {
    success: boolean;
    message: string;
    errors?: any;
    timestamp: string;
}
