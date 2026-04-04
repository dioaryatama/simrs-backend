import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany,
  JoinTable, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

// ── User Entity ──────────────────────────────────────────────────
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id', nullable: true })
  employeeId: string;

  @Index({ unique: true })
  @Column({ length: 50 })
  username: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: Date;

  @Column({ name: 'failed_login_count', default: 0 })
  failedLoginCount: number;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// ── Role Entity ──────────────────────────────────────────────────
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'is_system', default: false })
  isSystem: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}

// ── Permission Entity ────────────────────────────────────────────
@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id' })
  moduleId: string;

  @Column({ length: 100 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 20 })
  action: string;
}
