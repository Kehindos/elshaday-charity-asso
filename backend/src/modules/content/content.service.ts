import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentItem } from './entities/content-item.entity';
import { SiteSetting } from './entities/site-setting.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { FilterContentDto } from './dto/filter-content.dto';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-setting.dto';
import { ContentType } from '../../common/enums/content-type.enum';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentItem)
    private readonly contentRepository: Repository<ContentItem>,
    @InjectRepository(SiteSetting)
    private readonly settingRepository: Repository<SiteSetting>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<ContentItem> {
    const item = this.contentRepository.create({
      ...createContentDto,
      eventDate: createContentDto.eventDate ? new Date(createContentDto.eventDate) : null,
    });
    return this.contentRepository.save(item);
  }

  async findAll(filterDto: FilterContentDto) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      category,
      isPublished,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const skip = (page - 1) * limit;
    const query = this.contentRepository.createQueryBuilder('item');

    if (type) {
      query.andWhere('item.type = :type', { type });
    }

    if (category) {
      query.andWhere('item.category = :category', { category });
    }

    if (isPublished !== undefined) {
      query.andWhere('item.isPublished = :isPublished', { isPublished });
    }

    if (isFeatured !== undefined) {
      query.andWhere('item.isFeatured = :isFeatured', { isFeatured });
    }

    if (search) {
      query.andWhere(
        '(item.title LIKE :search OR item.titleAm LIKE :search OR item.subtitle LIKE :search OR item.content LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const validSortFields = ['id', 'title', 'createdAt', 'eventDate', 'displayOrder', 'targetAmount'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    query
      .orderBy(`item.displayOrder`, 'ASC')
      .addOrderBy(`item.${safeSortBy}`, sortOrder === 'ASC' ? 'ASC' : 'DESC')
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

  async findByType(type: ContentType, isPublished = true) {
    return this.contentRepository.find({
      where: { type, isPublished },
      order: { displayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ContentItem> {
    const item = await this.contentRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Content item #${id} not found`);
    }
    return item;
  }

  async update(id: number, updateContentDto: UpdateContentDto): Promise<ContentItem> {
    const item = await this.findOne(id);
    const updated = {
      ...updateContentDto,
      eventDate: updateContentDto.eventDate ? new Date(updateContentDto.eventDate) : item.eventDate,
    };
    Object.assign(item, updated);
    return this.contentRepository.save(item);
  }

  async remove(id: number): Promise<{ message: string }> {
    const item = await this.findOne(id);
    await this.contentRepository.remove(item);
    return { message: `Content item #${id} ("${item.title}") removed successfully` };
  }

  async togglePublish(id: number): Promise<ContentItem> {
    const item = await this.findOne(id);
    item.isPublished = !item.isPublished;
    return this.contentRepository.save(item);
  }

  // Site Settings Operations
  async getAllSettings(): Promise<Record<string, string>> {
    const settings = await this.settingRepository.find();
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  }

  async getSettingsByGroup(group: string) {
    return this.settingRepository.find({ where: { group } });
  }

  async setSetting(updateSettingDto: UpdateSettingDto): Promise<SiteSetting> {
    let setting = await this.settingRepository.findOne({
      where: { key: updateSettingDto.key },
    });

    if (setting) {
      setting.value = updateSettingDto.value;
      if (updateSettingDto.group) setting.group = updateSettingDto.group;
      if (updateSettingDto.description) setting.description = updateSettingDto.description;
    } else {
      setting = this.settingRepository.create(updateSettingDto);
    }

    return this.settingRepository.save(setting);
  }

  async bulkUpdateSettings(dto: BulkUpdateSettingsDto): Promise<Record<string, string>> {
    for (const [key, value] of Object.entries(dto.settings)) {
      let setting = await this.settingRepository.findOne({ where: { key } });
      if (setting) {
        setting.value = value;
      } else {
        setting = this.settingRepository.create({ key, value, group: 'general' });
      }
      await this.settingRepository.save(setting);
    }
    return this.getAllSettings();
  }

  async getContentStats() {
    const total = await this.contentRepository.count();
    const programs = await this.contentRepository.count({ where: { type: ContentType.PROGRAM } });
    const events = await this.contentRepository.count({ where: { type: ContentType.EVENT } });
    const news = await this.contentRepository.count({ where: { type: ContentType.NEWS } });
    const announcements = await this.contentRepository.count({
      where: { type: ContentType.ANNOUNCEMENT },
    });
    const gallery = await this.contentRepository.count({ where: { type: ContentType.GALLERY } });
    const about = await this.contentRepository.count({ where: { type: ContentType.ABOUT } });

    return {
      total,
      programs,
      events,
      news,
      announcements,
      gallery,
      about,
    };
  }
}
