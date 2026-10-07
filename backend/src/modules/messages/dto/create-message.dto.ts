import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Dawit Yohannes', description: 'Name of sender' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'dawit@example.com', description: 'Email address of sender' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({ example: '+251911998877', description: 'Phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiProperty({ example: 'Inquiry about community feeding program donation', description: 'Subject line' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  @ApiProperty({
    example: 'Hello, I would like to inquire about how to donate supplies for your school project.',
    description: 'Message content',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
