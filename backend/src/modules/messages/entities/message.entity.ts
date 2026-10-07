import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { MessageStatus } from '../../../common/enums/message-status.enum';

@Entity('contact_messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  fullName: string;

  @Index()
  @Column({ length: 150 })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 255 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Index()
  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.UNREAD,
  })
  status: MessageStatus;

  @Column({ type: 'text', nullable: true })
  adminNote: string;

  @Column({ type: 'datetime', nullable: true })
  repliedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
