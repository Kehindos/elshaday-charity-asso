import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VolunteerStatus } from '../../../common/enums/volunteer-status.enum';

export class UpdateVolunteerStatusDto {
  @ApiProperty({
    enum: VolunteerStatus,
    example: VolunteerStatus.APPROVED,
    description: 'New status for volunteer',
  })
  @IsNotEmpty()
  @IsEnum(VolunteerStatus)
  status: VolunteerStatus;

  @ApiPropertyOptional({
    example: 'Application reviewed and approved for Youth Education program.',
    description: 'Admin remarks / note on status change',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
