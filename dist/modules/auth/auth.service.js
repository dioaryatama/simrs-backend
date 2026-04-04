"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const auth_entity_1 = require("./auth.entity");
let AuthService = AuthService_1 = class AuthService {
    userRepo;
    jwtService;
    config;
    dataSource;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userRepo, jwtService, config, dataSource) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
        this.config = config;
        this.dataSource = dataSource;
    }
    async login(dto) {
        const user = await this.dataSource.query(`SELECT u.id, u.username, u.email, u.full_name, u.password_hash,
              u.is_active, u.failed_login_count, u.locked_until, u.employee_id,
              ARRAY_AGG(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL) AS roles,
              ARRAY_AGG(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL) AS permissions
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id AND r.is_active = true
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE u.username = $1
       GROUP BY u.id`, [dto.username]);
        const found = user[0];
        if (!found)
            throw new common_1.UnauthorizedException('Username atau password salah');
        if (!found.is_active)
            throw new common_1.UnauthorizedException('Akun dinonaktifkan');
        if (found.locked_until && new Date(found.locked_until) > new Date()) {
            throw new common_1.UnauthorizedException('Akun terkunci sementara, coba lagi nanti');
        }
        const valid = await bcrypt.compare(dto.password, found.password_hash);
        if (!valid) {
            await this.dataSource.query(`UPDATE users SET failed_login_count = failed_login_count + 1,
           locked_until = CASE WHEN failed_login_count >= 4
             THEN NOW() + INTERVAL '15 minutes' ELSE NULL END
         WHERE id = $1`, [found.id]);
            throw new common_1.UnauthorizedException('Username atau password salah');
        }
        await this.dataSource.query(`UPDATE users SET failed_login_count=0, locked_until=NULL, last_login_at=NOW() WHERE id=$1`, [found.id]);
        const payload = {
            sub: found.id,
            username: found.username,
            fullName: found.full_name,
            roles: found.roles || [],
            permissions: found.permissions || [],
            isActive: found.is_active,
        };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {
                secret: this.config.get('jwt.refreshSecret'),
                expiresIn: this.config.get('jwt.refreshExpiresIn'),
            }),
            user: {
                id: found.id,
                username: found.username,
                email: found.email,
                fullName: found.full_name,
                roles: found.roles || [],
            },
        };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.config.get('jwt.refreshSecret'),
            });
            const user = await this.userRepo.findOneBy({
                id: payload.sub,
                isActive: true,
            });
            if (!user)
                throw new common_1.UnauthorizedException();
            const newPayload = {
                sub: payload.sub,
                username: payload.username,
                fullName: payload.fullName,
                roles: payload.roles,
                permissions: payload.permissions,
                isActive: true,
            };
            return {
                accessToken: this.jwtService.sign(newPayload),
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token tidak valid');
        }
    }
    async getProfile(userId) {
        const rows = await this.dataSource.query(`SELECT u.id, u.username, u.email, u.full_name, u.is_active,
              u.last_login_at, u.created_at,
              ARRAY_AGG(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL) AS role_names,
              ARRAY_AGG(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL) AS permissions
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE u.id = $1
       GROUP BY u.id`, [userId]);
        if (!rows[0])
            throw new common_1.NotFoundException('User tidak ditemukan');
        return rows[0];
    }
    async changePassword(userId, dto) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new common_1.NotFoundException();
        const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!valid)
            throw new common_1.BadRequestException('Password lama tidak sesuai');
        const hash = await bcrypt.hash(dto.newPassword, 12);
        await this.userRepo.update(userId, {
            passwordHash: hash,
            passwordChangedAt: new Date(),
        });
        return { message: 'Password berhasil diubah' };
    }
    async createUser(dto) {
        const exists = await this.userRepo.findOneBy({ username: dto.username });
        if (exists)
            throw new common_1.ConflictException('Username sudah digunakan');
        const hash = await bcrypt.hash(dto.password, 12);
        const user = this.userRepo.create({
            username: dto.username,
            email: dto.email,
            passwordHash: hash,
            fullName: dto.fullName,
            employeeId: dto.employeeId,
        });
        const saved = await this.userRepo.save(user);
        if (dto.roleIds?.length) {
            for (const roleId of dto.roleIds) {
                await this.dataSource.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [saved.id, roleId]);
            }
        }
        return {
            id: saved.id,
            username: saved.username,
            message: 'User berhasil dibuat',
        };
    }
    async findAll(page = 1, limit = 20, search) {
        const offset = (page - 1) * limit;
        const where = search
            ? `AND (u.username ILIKE $3 OR u.full_name ILIKE $3)`
            : '';
        const params = [limit, offset];
        if (search)
            params.push(`%${search}%`);
        const [rows, count] = await Promise.all([
            this.dataSource.query(`SELECT u.id, u.username, u.email, u.full_name, u.is_active, u.last_login_at,
                ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) AS roles
         FROM users u
         LEFT JOIN user_roles ur ON ur.user_id = u.id
         LEFT JOIN roles r ON r.id = ur.role_id
         WHERE 1=1 ${where}
         GROUP BY u.id ORDER BY u.created_at DESC LIMIT $1 OFFSET $2`, params),
            this.dataSource.query(`SELECT COUNT(*) FROM users u WHERE 1=1 ${where}`, search ? [`%${search}%`] : []),
        ]);
        return { data: rows, total: parseInt(count[0].count), page, limit };
    }
    async updateUser(id, dto) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user)
            throw new common_1.NotFoundException('User tidak ditemukan');
        if (dto.email !== undefined)
            user.email = dto.email;
        if (dto.fullName !== undefined)
            user.fullName = dto.fullName;
        if (dto.isActive !== undefined)
            user.isActive = dto.isActive;
        await this.userRepo.save(user);
        if (dto.roleIds !== undefined) {
            await this.dataSource.query(`DELETE FROM user_roles WHERE user_id = $1`, [
                id,
            ]);
            for (const roleId of dto.roleIds) {
                await this.dataSource.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, roleId]);
            }
        }
        return { message: 'User berhasil diupdate' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map