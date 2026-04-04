export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class CreateUserDto {
    employeeId?: string;
    username: string;
    email?: string;
    password: string;
    fullName: string;
    roleIds?: string[];
}
export declare class UpdateUserDto {
    email?: string;
    fullName?: string;
    isActive?: boolean;
    roleIds?: string[];
}
export declare class AssignRoleDto {
    roleIds: string[];
}
