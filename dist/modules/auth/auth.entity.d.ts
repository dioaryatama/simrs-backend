export declare class User {
    id: string;
    employeeId: string;
    username: string;
    email: string;
    passwordHash: string;
    fullName: string;
    isActive: boolean;
    lastLoginAt: Date;
    failedLoginCount: number;
    lockedUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Role {
    id: string;
    code: string;
    name: string;
    description: string;
    isSystem: boolean;
    isActive: boolean;
}
export declare class Permission {
    id: string;
    moduleId: string;
    code: string;
    name: string;
    action: string;
}
