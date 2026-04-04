import {
  Controller, Post, Get, Put, Patch, Body, Param,
  Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto, RefreshTokenDto, ChangePasswordDto,
  CreateUserDto, UpdateUserDto,
} from './auth.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser, Public, Roles } from '../../common/decorators';

@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login dan dapatkan JWT token' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Lihat profil user yang sedang login' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Ganti password' })
  changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(userId, dto);
  }

  // ── User Management ───────────────────────────────────────────
  @Get('users')
  @Roles('SUPERADMIN', 'ADMIN_RS')
  @ApiOperation({ summary: 'Daftar semua user' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ) {
    return this.authService.findAll(+page, +limit, search);
  }

  @Post('users')
  @Roles('SUPERADMIN', 'ADMIN_RS')
  @ApiOperation({ summary: 'Buat user baru' })
  createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }

  @Put('users/:id')
  @Roles('SUPERADMIN', 'ADMIN_RS')
  @ApiOperation({ summary: 'Update data user' })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(id, dto);
  }
}
