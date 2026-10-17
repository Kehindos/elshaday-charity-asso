import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@charity.org', description: 'Admin registered email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin123!', description: 'Admin account password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
