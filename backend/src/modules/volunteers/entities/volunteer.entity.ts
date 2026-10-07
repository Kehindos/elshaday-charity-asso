import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { VolunteerStatus } from '../../../common/enums/volunteer-status.enum';

@Entity('volunteers')
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  fullName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Index()
  @Column({ length: 50 })
  phone: string;

  @Column({ nullable: true, length: 20 })
  gender: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true, length: 255 })
  address: string;

  @Column({ nullable: true, length: 100 })
  city: string;

  @Column({ nullable: true, length: 100 })
  occupation: string;

  @Column({ nullable: true, type: 'simple-array' })
  skills: string[];

  @Column({ nullable: true, type: 'simple-array' })
  areasOfInterest: string[];

  @Column({ nullable: true, length: 100 })
  availability: string;

  @Column({ type: 'text', nullable: true })
  motivation: string;

  @Column({ type: 'text', nullable: true })
  previousExperience: string;

  @Column({ nullable: true, length: 255 })
  profilePhotoUrl: string;

  @Column({ nullable: true, length: 255 })
  idDocumentUrl: string;

  @Column({ nullable: true, length: 255 })
  cvUrl: string;

  @Index()
  @Column({
    type: 'enum',
    enum: VolunteerStatus,
    default: VolunteerStatus.PENDING,
  })
  status: VolunteerStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ nullable: true, length: 100 })
  approvedByAdminName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
