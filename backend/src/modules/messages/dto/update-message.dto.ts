import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MessageStatus } from '../../../common/enums/message-status.enum';

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
