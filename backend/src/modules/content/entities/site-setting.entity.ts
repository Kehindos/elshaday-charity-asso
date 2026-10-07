import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ length: 50, default: 'general' })
  group: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
