import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ContentType, MediaCategory } from '../../../common/enums/content-type.enum';

@Entity('content_items')
export class ContentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.NEWS,
  })
  type: ContentType;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, nullable: true })
  titleAm: string;

  @Column({ length: 255, nullable: true })
  subtitle: string;

  @Column({ type: 'longtext', nullable: true })
  content: string;

  @Column({ type: 'longtext', nullable: true })
  contentAm: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: MediaCategory,
    default: MediaCategory.IMAGE,
  })
  mediaCategory: MediaCategory;

  @Column({ length: 500, nullable: true })
  mediaUrl: string;

  @Column({ length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'datetime', nullable: true })
  eventDate: Date;

  @Column({ length: 255, nullable: true })
  location: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
