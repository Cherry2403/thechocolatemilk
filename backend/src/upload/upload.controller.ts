import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import type { Response } from 'express';
import { existsSync } from 'fs';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Handles user image uploads (e.g. chat image attachments).
 *
 * Files are stored locally in /uploads/ during development.
 * In production, swap diskStorage for S3/Cloudinary (Phase 10).
 *
 * Upload: POST /api/upload/image → { url: '/api/upload/file/<filename>' }
 * Serve:  GET  /api/upload/file/:filename → image file
 */
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || '.jpg';
          cb(null, `${uuid()}${ext}`);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIMES.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              `Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIMES.join(', ')}`,
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return {
      url: `/api/upload/file/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  @Get('file/:filename')
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    // Sanitize — prevent directory traversal
    const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const filePath = join(UPLOAD_DIR, safe);

    if (!existsSync(filePath)) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    res.sendFile(filePath);
  }
}
