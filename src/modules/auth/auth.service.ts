import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from './auth.entity';
import {
  LoginDto,
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private dataSource: DataSource,
  ) {}

  // ── Login ──────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.dataSource.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.password_hash,
              u.is_active, u.failed_login_count, u.locked_until, u.employee_id,
              ARRAY_AGG(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL) AS roles,
              ARRAY_AGG(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL) AS permissions
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id AND r.is_active = true
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE u.username = $1
       GROUP BY u.id`,
      [dto.username],
    );

    const found = user[0];
    if (!found) throw new UnauthorizedException('Username atau password salah');
    if (!found.is_active) throw new UnauthorizedException('Akun dinonaktifkan');

    // Cek lock
    if (found.locked_until && new Date(found.locked_until) > new Date()) {
      throw new UnauthorizedException(
        'Akun terkunci sementara, coba lagi nanti',
      );
    }
    const valid = await bcrypt.compare(dto.password, found.password_hash);
    if (!valid) {
      // Increment failed count (raw SQL to avoid TypeORM null type issues)
      await this.dataSource.query(
        `UPDATE users SET failed_login_count = failed_login_count + 1,
           locked_until = CASE WHEN failed_login_count >= 4
             THEN NOW() + INTERVAL '15 minutes' ELSE NULL END
         WHERE id = $1`,
        [found.id],
      );
      throw new UnauthorizedException('Username atau password salah');
    }

    // Reset failed count & update last login
    await this.dataSource.query(
      `UPDATE users SET failed_login_count=0, locked_until=NULL, last_login_at=NOW() WHERE id=$1`,
      [found.id],
    );

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

  // ── Refresh token ──────────────────────────────────────────────
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get('jwt.refreshSecret'),
      });
      const user = await this.userRepo.findOneBy({
        id: payload.sub,
        isActive: true,
      });
      if (!user) throw new UnauthorizedException();

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
    } catch {
      throw new UnauthorizedException('Refresh token tidak valid');
    }
  }

  // ── Get current user profile ───────────────────────────────────
  async getProfile(userId: string) {
    const rows = await this.dataSource.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.is_active,
              u.last_login_at, u.created_at,
              ARRAY_AGG(DISTINCT r.name) FILTER (WHERE r.name IS NOT NULL) AS role_names,
              ARRAY_AGG(DISTINCT p.code) FILTER (WHERE p.code IS NOT NULL) AS permissions
       FROM users u
       LEFT JOIN user_roles ur ON ur.user_id = u.id
       LEFT JOIN roles r ON r.id = ur.role_id
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [userId],
    );
    if (!rows[0]) throw new NotFoundException('User tidak ditemukan');
    return rows[0];
  }

  // ── Change password ────────────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException();

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new BadRequestException('Password lama tidak sesuai');

    const hash = await bcrypt.hash(dto.newPassword, 12);
    await this.userRepo.update(userId, {
      passwordHash: hash,
      // @ts-ignore
      passwordChangedAt: new Date(),
    });
    return { message: 'Password berhasil diubah' };
  }

  // ── Create user ────────────────────────────────────────────────
  async createUser(dto: CreateUserDto) {
    const exists = await this.userRepo.findOneBy({ username: dto.username });
    if (exists) throw new ConflictException('Username sudah digunakan');

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
        await this.dataSource.query(
          `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [saved.id, roleId],
        );
      }
    }
    return {
      id: saved.id,
      username: saved.username,
      message: 'User berhasil dibuat',
    };
  }

  // ── List users ─────────────────────────────────────────────────
  async findAll(page = 1, limit = 20, search?: string) {
    const offset = (page - 1) * limit;
    const where = search
      ? `AND (u.username ILIKE $3 OR u.full_name ILIKE $3)`
      : '';
    const params: any[] = [limit, offset];
    if (search) params.push(`%${search}%`);

    const [rows, count] = await Promise.all([
      this.dataSource.query(
        `SELECT u.id, u.username, u.email, u.full_name, u.is_active, u.last_login_at,
                ARRAY_AGG(r.name) FILTER (WHERE r.name IS NOT NULL) AS roles
         FROM users u
         LEFT JOIN user_roles ur ON ur.user_id = u.id
         LEFT JOIN roles r ON r.id = ur.role_id
         WHERE 1=1 ${where}
         GROUP BY u.id ORDER BY u.created_at DESC LIMIT $1 OFFSET $2`,
        params,
      ),
      this.dataSource.query(
        `SELECT COUNT(*) FROM users u WHERE 1=1 ${where}`,
        search ? [`%${search}%`] : [],
      ),
    ]);
    return { data: rows, total: parseInt(count[0].count), page, limit };
  }

  // ── Update user ────────────────────────────────────────────────
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    if (dto.email !== undefined) user.email = dto.email;
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    await this.userRepo.save(user);

    if (dto.roleIds !== undefined) {
      await this.dataSource.query(`DELETE FROM user_roles WHERE user_id = $1`, [
        id,
      ]);
      for (const roleId of dto.roleIds) {
        await this.dataSource.query(
          `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [id, roleId],
        );
      }
    }
    return { message: 'User berhasil diupdate' };
  }
}
