import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateVolunteerDto {
  @ApiProperty({ example: 'Abebe Bikila', description: 'Full name of the volunteer applicant' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'abebe@example.com', description: 'Volunteer email address' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({ example: '+251911223344', description: 'Contact phone number' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  phone: string;

  @ApiPropertyOptional({ example: 'Male', description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ example: '1995-05-20', description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'Bole, Sub-city, Woreda 03', description: 'Residential address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Addis Ababa', description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Teacher / Software Developer', description: 'Occupation or Profession' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({
    example: ['Teaching', 'Graphic Design', 'First Aid', 'Event Coordination'],
    description: 'List of volunteer skills',
  })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional({
    example: ['Child Education', 'Food Distribution', 'Healthcare', 'Community Outreach'],
    description: 'Areas of interest to volunteer in',
  })
  @IsOptional()
  @IsArray()
  areasOfInterest?: string[];

  @ApiPropertyOptional({
    example: 'Weekends & Evenings',
    description: 'Availability schedule',
  })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiPropertyOptional({
    example: 'I want to give back to the community and support children in need.',
    description: 'Statement of motivation',
  })
  @IsOptional()
  @IsString()
  motivation?: string;

  @ApiPropertyOptional({
    example: '2 years volunteering with Red Cross youth community group.',
    description: 'Previous volunteer experience',
  })
  @IsOptional()
  @IsString()
  previousExperience?: string;

  @ApiPropertyOptional({ description: 'URL of uploaded profile photo' })
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @ApiPropertyOptional({ description: 'URL of uploaded National ID or Passport document' })
  @IsOptional()
  @IsString()
  idDocumentUrl?: string;

  @ApiPropertyOptional({ description: 'URL of uploaded CV / Resume' })
  @IsOptional()
  @IsString()
  cvUrl?: string;
}
