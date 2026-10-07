import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message.dto';
import { FilterMessageDto, AddAdminNoteDto } from './dto/filter-message.dto';
import { MessageStatus } from '../../common/enums/message-status.enum';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      ...createMessageDto,
      email: createMessageDto.email.toLowerCase(),
      status: MessageStatus.UNREAD,
    });
    return this.messageRepository.save(message);
  }

  async findAll(filterDto: FilterMessageDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filterDto;

    const skip = (page - 1) * limit;
    const query = this.messageRepository.createQueryBuilder('msg');

    if (status) {
      query.andWhere('msg.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(msg.fullName LIKE :search OR msg.email LIKE :search OR msg.subject LIKE :search OR msg.message LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const validSortFields = ['id', 'fullName', 'email', 'status', 'createdAt'];
    const safeSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    query
      .orderBy(`msg.${safeSortBy}`, sortOrder === 'ASC' ? 'ASC' : 'DESC')
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

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      throw new NotFoundException(`Message #${id} not found`);
    }
    return message;
  }

  async updateStatus(id: number, updateDto: UpdateMessageStatusDto): Promise<Message> {
    const message = await this.findOne(id);
    message.status = updateDto.status;
    if (updateDto.status === MessageStatus.REPLIED && !message.repliedAt) {
      message.repliedAt = new Date();
    }
    return this.messageRepository.save(message);
  }

  async addNote(id: number, noteDto: AddAdminNoteDto): Promise<Message> {
    const message = await this.findOne(id);
    message.adminNote = noteDto.note;
    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<{ message: string }> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
    return { message: `Message #${id} from ${message.fullName} has been deleted` };
  }

  async getStats() {
    const total = await this.messageRepository.count();
    const unread = await this.messageRepository.count({
      where: { status: MessageStatus.UNREAD },
    });
    const read = await this.messageRepository.count({
      where: { status: MessageStatus.READ },
    });
    const replied = await this.messageRepository.count({
      where: { status: MessageStatus.REPLIED },
    });
    const archived = await this.messageRepository.count({
      where: { status: MessageStatus.ARCHIVED },
    });

    return {
      total,
      unread,
      read,
      replied,
      archived,
    };
  }
}
