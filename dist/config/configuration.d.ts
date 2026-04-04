export declare const appConfig: (() => {
    nodeEnv: string;
    port: number;
    name: string;
    url: string;
    corsOrigins: string[];
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    nodeEnv: string;
    port: number;
    name: string;
    url: string;
    corsOrigins: string[];
}>;
export declare const dbConfig: (() => {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
}>;
export declare const jwtConfig: (() => {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}>;
export declare const bpjsConfig: (() => {
    consId: string;
    secretKey: string;
    userKey: string;
    baseUrl: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    consId: string;
    secretKey: string;
    userKey: string;
    baseUrl: string;
}>;
