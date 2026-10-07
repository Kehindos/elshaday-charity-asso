import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVolunteerDto } from './create-volunteer.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VolunteerStatus } from '../../../common/enums/volunteer-status.enum';

export class UpdateVolunteerDto extends PartialType(CreateVolunteerDto) {
  @ApiPropertyOptional({ enum: VolunteerStatus })
  @IsOptional()
  @IsEnum(VolunteerStatus)
  status?: VolunteerStatus;

  @ApiPropertyOptional({ description: 'Internal admin notes or remarks' })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
