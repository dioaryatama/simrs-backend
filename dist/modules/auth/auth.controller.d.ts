import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, ChangePasswordDto, CreateUserDto, UpdateUserDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            username: any;
            email: any;
            fullName: any;
            roles: any;
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<any>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
    }>;
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        username: string;
        message: string;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        message: string;
    }>;
}
