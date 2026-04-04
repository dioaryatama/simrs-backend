import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './auth.entity';
import { LoginDto, CreateUserDto, UpdateUserDto, ChangePasswordDto } from './auth.dto';
export declare class AuthService {
    private userRepo;
    private jwtService;
    private config;
    private dataSource;
    private readonly logger;
    constructor(userRepo: Repository<User>, jwtService: JwtService, config: ConfigService, dataSource: DataSource);
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
    refreshToken(token: string): Promise<{
        accessToken: string;
    }>;
    getProfile(userId: string): Promise<any>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    createUser(dto: CreateUserDto): Promise<{
        id: string;
        username: string;
        message: string;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: any;
        total: number;
        page: number;
        limit: number;
    }>;
    updateUser(id: string, dto: UpdateUserDto): Promise<{
        message: string;
    }>;
}
