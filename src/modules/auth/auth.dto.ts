import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'dr_budi' })
  @IsString() @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Admin@1234' })
  @IsString() @IsNotEmpty() @MinLength(6)
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  refreshToken: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString() @IsNotEmpty() @MinLength(8)
  newPassword: string;
}

export class CreateUserDto {
  @ApiPropertyOptional()
  @IsOptional() @IsUUID()
  employeeId?: string;

  @ApiProperty({ example: 'john_doe' })
  @IsString() @IsNotEmpty()
  username: string;

  @ApiPropertyOptional()
  @IsOptional() @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString() @IsNotEmpty() @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString() @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsUUID('all', { each: true })
  roleIds?: string[];
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional() @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional() @IsArray() @IsUUID('all', { each: true })
  roleIds?: string[];
}

export class AssignRoleDto {
  @ApiProperty({ type: [String] })
  @IsArray() @IsUUID('all', { each: true })
  roleIds: string[];
}
