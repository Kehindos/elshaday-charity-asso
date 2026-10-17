import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateContentDto } from './create-content.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContentType } from '../../../common/enums/content-type.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {}

export class FilterContentDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ContentType, description: 'Filter by content type' })
  @IsOptional()
  @IsEnum(ContentType)
  type?: ContentType;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter published only (default for public requests)' })
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Filter featured only' })
  @IsOptional()
  isFeatured?: boolean;
}
