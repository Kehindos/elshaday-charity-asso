import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { UpdateVolunteerStatusDto } from './dto/update-volunteer-status.dto';
import { FilterVolunteerDto } from './dto/filter-volunteer.dto';
import { VolunteerStatus } from '../../common/enums/volunteer-status.enum';

@Injectable()
export class VolunteersService {
  constructor(
    @InjectRepository(Volunteer)
    private readonly volunteerRepository: Repository<Volunteer>,
  ) {}

  async register(createVolunteerDto: CreateVolunteerDto): Promise<Volunteer> {
    const existing = await this.volunteerRepository.findOne({
      where: { email: createVolunteerDto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException(
        `A volunteer application with email "${createVolunteerDto.email}" already exists (Current status: ${existing.status})`,
      );
    }

    const volunteer = this.volunteerRepository.create({
      ...createVolunteerDto,
      email: createVolunteerDto.email.toLowerCase(),
      status: VolunteerStatus.PENDING,
    });

    return this.volunteerRepository.save(volunteer);
  }

  async findAll(filterDto: FilterVolunteerDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      skill,
      areaOfInterest,
      city,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const skip = (page - 1) * limit;
    const query = this.volunteerRepository.createQueryBuilder('volunteer');

    if (status) {
      query.andWhere('volunteer.status = :status', { status });
    }

    if (city) {
      query.andWhere('volunteer.city LIKE :city', { city: `%${city}%` });
    }

    if (skill) {
      query.andWhere('volunteer.skills LIKE :skill', { skill: `%${skill}%` });
    }

    if (areaOfInterest) {
      query.andWhere('volunteer.areasOfInterest LIKE :area', {
        area: `%${areaOfInterest}%`,
      });
    }

    if (search) {
      query.andWhere(
        '(volunteer.fullName LIKE :search OR volunteer.email LIKE :search OR volunteer.phone LIKE :search OR volunteer.occupation LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const validSortFields = ['id', 'fullName', 'email', 'status', 'createdAt', 'updatedAt', 'city'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    query
      .orderBy(`volunteer.${safeSortBy}`, sortOrder === 'ASC' ? 'ASC' : 'DESC')
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

  async findOne(id: number): Promise<Volunteer> {
    const volunteer = await this.volunteerRepository.findOne({ where: { id } });
    if (!volunteer) {
      throw new NotFoundException(`Volunteer with ID #${id} not found`);
    }
    return volunteer;
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateVolunteerStatusDto,
    adminName = 'Admin',
  ): Promise<Volunteer> {
    const volunteer = await this.findOne(id);

    volunteer.status = updateStatusDto.status;
    if (updateStatusDto.adminNotes) {
      volunteer.adminNotes = updateStatusDto.adminNotes;
    }

    if (updateStatusDto.status === VolunteerStatus.APPROVED || updateStatusDto.status === VolunteerStatus.ACTIVE) {
      volunteer.approvedAt = new Date();
      volunteer.approvedByAdminName = adminName;
    }

    return this.volunteerRepository.save(volunteer);
  }

  async update(id: number, updateVolunteerDto: UpdateVolunteerDto): Promise<Volunteer> {
    const volunteer = await this.findOne(id);

    if (updateVolunteerDto.email && updateVolunteerDto.email.toLowerCase() !== volunteer.email) {
      const existing = await this.volunteerRepository.findOne({
        where: { email: updateVolunteerDto.email.toLowerCase() },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Email address is already in use by another volunteer');
      }
      volunteer.email = updateVolunteerDto.email.toLowerCase();
    }

    Object.assign(volunteer, updateVolunteerDto);
    return this.volunteerRepository.save(volunteer);
  }

  async remove(id: number): Promise<{ message: string }> {
    const volunteer = await this.findOne(id);
    await this.volunteerRepository.remove(volunteer);
    return { message: `Volunteer registration #${id} (${volunteer.fullName}) removed successfully` };
  }

  async getStatistics() {
    const total = await this.volunteerRepository.count();
    const pending = await this.volunteerRepository.count({
      where: { status: VolunteerStatus.PENDING },
    });
    const approved = await this.volunteerRepository.count({
      where: { status: VolunteerStatus.APPROVED },
    });
    const rejected = await this.volunteerRepository.count({
      where: { status: VolunteerStatus.REJECTED },
    });
    const active = await this.volunteerRepository.count({
      where: { status: VolunteerStatus.ACTIVE },
    });
    const inactive = await this.volunteerRepository.count({
      where: { status: VolunteerStatus.INACTIVE },
    });

    // Recent volunteers (last 5)
    const recent = await this.volunteerRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      total,
      pending,
      approved,
      rejected,
      active,
      inactive,
      breakdown: {
        pendingPercent: total > 0 ? Number(((pending / total) * 100).toFixed(1)) : 0,
        approvedPercent: total > 0 ? Number(((approved / total) * 100).toFixed(1)) : 0,
        activePercent: total > 0 ? Number(((active / total) * 100).toFixed(1)) : 0,
        inactivePercent: total > 0 ? Number(((inactive / total) * 100).toFixed(1)) : 0,
        rejectedPercent: total > 0 ? Number(((rejected / total) * 100).toFixed(1)) : 0,
      },
      recent,
    };
  }
}
