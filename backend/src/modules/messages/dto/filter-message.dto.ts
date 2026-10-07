import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageStatus } from '../../../common/enums/message-status.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UpdateMessageStatusDto {
  @ApiProperty({
    enum: MessageStatus,
    example: MessageStatus.READ,
    description: 'Updated status of the message',
  })
  @IsNotEmpty()
  @IsEnum(MessageStatus)
  status: MessageStatus;
}

export class AddAdminNoteDto {
  @ApiProperty({
    example: 'Replied to user via phone call on Oct 6.',
    description: 'Internal admin note or follow-up comment',
  })
  @IsNotEmpty()
  @IsString()
  note: string;
}

export class FilterMessageDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: MessageStatus,
    description: 'Filter by message status (UNREAD, READ, REPLIED, ARCHIVED)',
  })
  @IsOptional()
  @IsEnum(MessageStatus)
  status?: MessageStatus;
}
