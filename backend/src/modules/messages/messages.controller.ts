import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message.dto';
import { FilterMessageDto, AddAdminNoteDto } from './dto/filter-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Contact Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Public: Submit Contact Form Message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Admin: List contact messages with filters and search' })
  findAll(@Query() filterDto: FilterMessageDto) {
    return this.messagesService.findAll(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats')
  @ApiOperation({ summary: 'Admin: Get messages statistics (Total, Unread, Replied, etc.)' })
  getStats() {
    return this.messagesService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Admin: Get single message details' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({ summary: 'Admin: Update message status (UNREAD, READ, REPLIED, ARCHIVED)' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMessageStatusDto,
  ) {
    return this.messagesService.updateStatus(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/note')
  @ApiOperation({ summary: 'Admin: Add internal admin note to message' })
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() noteDto: AddAdminNoteDto,
  ) {
    return this.messagesService.addNote(id, noteDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Admin: Delete contact message' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.messagesService.remove(id);
  }
}
