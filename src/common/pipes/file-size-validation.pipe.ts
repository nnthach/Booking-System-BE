import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type File from 'multer';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private readonly maxSize: number) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    if (file.size > this.maxSize) {
      throw new BadRequestException(
        `File too large. Max size is ${this.maxSize}`,
      );
    }

    return file;
  }
}
