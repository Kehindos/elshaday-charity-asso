import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, pass: string): Promise<any> {
    const admin = await this.adminService.findByEmail(email, true);
    if (!admin) {
      return null;
    }

    const isMatch = await admin.validatePassword(pass);
    if (!isMatch) {
      return null;
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account has been deactivated');
    }

    const { password, ...result } = admin;
    return result;
  }

  async login(loginDto: LoginDto) {
    const admin = await this.validateAdmin(loginDto.email, loginDto.password);
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.adminService.updateLastLogin(admin.id);

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLoginAt: admin.lastLoginAt,
      },
    };
  }

  async changePassword(adminId: string, changePasswordDto: ChangePasswordDto) {
    const admin = await this.adminService.findOne(adminId);
    const adminWithPass = await this.adminService.findByEmail(admin.email, true);

    const isMatch = await adminWithPass.validatePassword(changePasswordDto.currentPassword);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match');
    }

    await this.adminService.update(adminId, { password: changePasswordDto.newPassword });
    return { message: 'Password changed successfully' };
  }
}
