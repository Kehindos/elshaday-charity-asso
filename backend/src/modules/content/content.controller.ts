import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { FilterContentDto } from './dto/filter-content.dto';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';
import { ContentType } from '../../common/enums/content-type.enum';

@ApiTags('Website Content & Settings')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  // ---------------- PUBLIC FRONTEND ENDPOINTS ----------------

  @Public()
  @Get('public/about')
  @ApiOperation({ summary: 'Public: Get About Us content items' })
  getPublicAbout() {
    return this.contentService.findByType(ContentType.ABOUT, true);
  }

  @Public()
  @Get('public/programs')
  @ApiOperation({ summary: 'Public: Get published Programs/Projects' })
  getPublicPrograms() {
    return this.contentService.findByType(ContentType.PROGRAM, true);
  }

  @Public()
  @Get('public/events')
  @ApiOperation({ summary: 'Public: Get published Events' })
  getPublicEvents() {
    return this.contentService.findByType(ContentType.EVENT, true);
  }

  @Public()
  @Get('public/news')
  @ApiOperation({ summary: 'Public: Get published News articles' })
  getPublicNews() {
    return this.contentService.findByType(ContentType.NEWS, true);
  }

  @Public()
  @Get('public/announcements')
  @ApiOperation({ summary: 'Public: Get published Announcements' })
  getPublicAnnouncements() {
    return this.contentService.findByType(ContentType.ANNOUNCEMENT, true);
  }

  @Public()
  @Get('public/gallery')
  @ApiOperation({ summary: 'Public: Get Gallery media items (Photos, Videos, Audios)' })
  getPublicGallery() {
    return this.contentService.findByType(ContentType.GALLERY, true);
  }

  @Public()
  @Get('public/settings')
  @ApiOperation({ summary: 'Public: Get organization contact information & site settings' })
  getPublicSettings() {
    return this.contentService.getAllSettings();
  }

  @Public()
  @Get('public/item/:id')
  @ApiOperation({ summary: 'Public: Get specific content item by ID' })
  getPublicItem(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.findOne(id);
  }

  // ---------------- ADMIN PROTECTED ENDPOINTS ----------------

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/list')
  @ApiOperation({ summary: 'Admin: List all content items with filtering and pagination' })
  findAll(@Query() filterDto: FilterContentDto) {
    return this.contentService.findAll(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('admin/item')
  @ApiOperation({ summary: 'Admin: Create new content item (Program, Event, News, Gallery, About)' })
  @ApiResponse({ status: 201, description: 'Content created successfully' })
  create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.create(createContentDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/item/:id')
  @ApiOperation({ summary: 'Admin: Get single content item by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('admin/item/:id')
  @ApiOperation({ summary: 'Admin: Update content item' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(id, updateContentDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('admin/item/:id')
  @ApiOperation({ summary: 'Admin: Delete content item' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('admin/item/:id/toggle-publish')
  @ApiOperation({ summary: 'Admin: Toggle publish/unpublish state' })
  togglePublish(@Param('id', ParseIntPipe) id: number) {
    return this.contentService.togglePublish(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('admin/settings')
  @ApiOperation({ summary: 'Admin: Update or create individual setting' })
  updateSetting(@Body() updateSettingDto: UpdateSettingDto) {
    return this.contentService.setSetting(updateSettingDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('admin/settings/bulk')
  @ApiOperation({ summary: 'Admin: Bulk update organization settings' })
  bulkUpdateSettings(@Body() bulkDto: BulkUpdateSettingsDto) {
    return this.contentService.bulkUpdateSettings(bulkDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('admin/stats')
  @ApiOperation({ summary: 'Admin: Content items statistics by type' })
  getContentStats() {
    return this.contentService.getContentStats();
  }
}
