import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  handleUploadedFile(file: Express.Multer.File, category = 'general') {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const relativePath = `/uploads/${file.filename}`;
    return {
      originalName: file.originalname,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: relativePath,
      category,
    };
  }

  handleUploadedFiles(files: Express.Multer.File[], category = 'general') {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return files.map((file) => this.handleUploadedFile(file, category));
  }
}
