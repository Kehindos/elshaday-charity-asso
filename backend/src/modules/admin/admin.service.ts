import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existing = await this.adminRepository.findOne({
      where: { email: createAdminDto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An admin with this email already exists');
    }

    const admin = this.adminRepository.create({
      ...createAdminDto,
      email: createAdminDto.email.toLowerCase(),
    });

    return this.adminRepository.save(admin);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.adminRepository.createQueryBuilder('admin');

    if (search) {
      query.where('admin.name LIKE :search OR admin.email LIKE :search', {
        search: `%${search}%`,
      });
    }

    query
      .orderBy(`admin.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID "${id}" not found`);
    }
    return admin;
  }

  async findByEmail(email: string, includePassword = false): Promise<Admin | null> {
    if (includePassword) {
      return this.adminRepository
        .createQueryBuilder('admin')
        .addSelect('admin.password')
        .where('admin.email = :email', { email: email.toLowerCase() })
        .getOne();
    }
    return this.adminRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.findOne(id);

    if (updateAdminDto.email && updateAdminDto.email.toLowerCase() !== admin.email) {
      const existing = await this.adminRepository.findOne({
        where: { email: updateAdminDto.email.toLowerCase() },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Email is already taken by another admin');
      }
      admin.email = updateAdminDto.email.toLowerCase();
    }

    if (updateAdminDto.name) admin.name = updateAdminDto.name;
    if (updateAdminDto.role) admin.role = updateAdminDto.role;
    if (updateAdminDto.isActive !== undefined) admin.isActive = updateAdminDto.isActive;
    if (updateAdminDto.password) admin.password = updateAdminDto.password;

    return this.adminRepository.save(admin);
  }

  async remove(id: string): Promise<{ message: string }> {
    const admin = await this.findOne(id);
    await this.adminRepository.remove(admin);
    return { message: `Admin "${admin.name}" has been removed successfully` };
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.adminRepository.update(id, { lastLoginAt: new Date() });
  }

  async count(): Promise<number> {
    return this.adminRepository.count();
  }
}
