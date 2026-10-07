import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { VolunteerStatus } from '../../../common/enums/volunteer-status.enum';

export class FilterVolunteerDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: VolunteerStatus,
    description: 'Filter by volunteer status (PENDING, APPROVED, REJECTED, ACTIVE, INACTIVE)',
  })
  @IsOptional()
  @IsEnum(VolunteerStatus)
  status?: VolunteerStatus;

  @ApiPropertyOptional({ description: 'Filter by specific skill (partial match)' })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional({ description: 'Filter by specific area of interest (partial match)' })
  @IsOptional()
  @IsString()
  areaOfInterest?: string;

  @ApiPropertyOptional({ description: 'Filter by city' })
  @IsOptional()
  @IsString()
  city?: string;
}
