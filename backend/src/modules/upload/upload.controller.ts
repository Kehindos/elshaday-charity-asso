import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

@ApiTags('Media & File Uploads')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post('file')
  @ApiOperation({ summary: 'Public/Admin: Upload single file (Photo, Document, ID, CV, Media)' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'category', required: false, enum: ['volunteer', 'gallery', 'program', 'event', 'general'] })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage, limits: { fileSize: 50 * 1024 * 1024 } })) // 50MB
  uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category = 'general',
  ) {
    return this.uploadService.handleUploadedFile(file, category);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('multiple')
  @ApiOperation({ summary: 'Admin: Upload multiple files (Gallery batches, media)' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'category', required: false })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10, { storage, limits: { fileSize: 50 * 1024 * 1024 } }))
  uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('category') category = 'general',
  ) {
    return this.uploadService.handleUploadedFiles(files, category);
  }
}
