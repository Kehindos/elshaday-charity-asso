import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ example: 'contact_email', description: 'Unique setting key' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ example: 'info@elshaday.org', description: 'Setting value' })
  @IsNotEmpty()
  @IsString()
  value: string;

  @ApiPropertyOptional({ example: 'contact', description: 'Settings grouping category' })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiPropertyOptional({ example: 'Official contact email address', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class BulkUpdateSettingsDto {
  @ApiProperty({
    example: {
      org_name: 'Elshaday Charity Organization',
      org_phone: '+251911000000',
      org_email: 'contact@elshaday.org',
      org_address: 'Addis Ababa, Ethiopia',
    },
  })
  @IsNotEmpty()
  settings: Record<string, string>;
}
