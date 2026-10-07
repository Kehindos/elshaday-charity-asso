import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { AdminRole } from '../../../common/enums/admin-role.enum';

export class CreateAdminDto {
  @ApiProperty({ example: 'Admin User', description: 'Full name of the admin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'admin@charity.org', description: 'Unique email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password (min 6 characters)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: AdminRole, default: AdminRole.ADMIN, description: 'Role of the admin' })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole = AdminRole.ADMIN;
}
