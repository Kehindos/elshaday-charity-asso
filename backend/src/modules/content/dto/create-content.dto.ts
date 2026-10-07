import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContentType, MediaCategory } from '../../../common/enums/content-type.enum';

export class CreateContentDto {
  @ApiProperty({
    enum: ContentType,
    example: ContentType.PROGRAM,
    description: 'Type of content (ABOUT, PROGRAM, EVENT, NEWS, ANNOUNCEMENT, GALLERY)',
  })
  @IsNotEmpty()
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty({ example: 'Child Nutrition & School Feeding', description: 'Title of the content in English' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'የህፃናት አመጋገብ እና የትምህርት ቤት ምገባ', description: 'Title in Amharic' })
  @IsOptional()
  @IsString()
  titleAm?: string;

  @ApiPropertyOptional({ example: 'Providing daily meals to over 500 vulnerable children', description: 'Subtitle' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'Detailed description of the program/event/news...', description: 'Main content body' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'የፕሮግራሙ ዝርዝር መግለጫ...', description: 'Amharic body content' })
  @IsOptional()
  @IsString()
  contentAm?: string;

  @ApiPropertyOptional({ example: 'Education / Healthcare / Emergency Aid', description: 'Content Category' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: MediaCategory,
    default: MediaCategory.IMAGE,
    description: 'Media format (IMAGE, VIDEO, AUDIO, DOCUMENT)',
  })
  @IsOptional()
  @IsEnum(MediaCategory)
  mediaCategory?: MediaCategory = MediaCategory.IMAGE;

  @ApiPropertyOptional({ example: '/uploads/programs/child-feeding.jpg', description: 'Media file URL or stream' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional({ example: '/uploads/thumbnails/child-feeding-thumb.jpg', description: 'Thumbnail URL' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 50000, description: 'Fundraising target amount if applicable' })
  @IsOptional()
  @IsNumber()
  targetAmount?: number;

  @ApiPropertyOptional({ example: 12500, description: 'Current raised amount' })
  @IsOptional()
  @IsNumber()
  currentAmount?: number;

  @ApiPropertyOptional({ example: '2026-11-15T09:00:00Z', description: 'Event date/time for events' })
  @IsOptional()
  @IsString()
  eventDate?: string;

  @ApiPropertyOptional({ example: 'Millennium Hall, Addis Ababa', description: 'Event location' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Published status' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = true;

  @ApiPropertyOptional({ example: false, default: false, description: 'Featured on homepage' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;

  @ApiPropertyOptional({ example: 1, default: 0, description: 'Display sort ordering' })
  @IsOptional()
  @IsNumber()
  displayOrder?: number = 0;

  @ApiPropertyOptional({ example: ['children', 'charity', 'ethiopia'], description: 'Tags' })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional custom metadata in JSON' })
  @IsOptional()
  metadata?: Record<string, any>;
}
