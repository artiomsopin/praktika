import { Injectable, OnModuleInit } from '@nestjs/common';
import { File, PrismaClient } from 'generated/prisma';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async getAllExistingFiles(): Promise<File[]> {
    return this.file.findMany();
  }

  async saveNewFiles(files: FileEntity[]): Promise<void> {
    await this.file.createMany({
      data: files,
      skipDuplicates: true, // Avoid duplicates based on unique constraints
    });
  }

  async saveNewFile(file: FileEntity): Promise<File> {
    return this.file.create({
      data: {
        file_name: file.file_name,
        size: file.size,
        file_type: file.file_type,
        modified: file.modified,
        content: file.content ? { create: file.content } : undefined,
      },
    });
  }
}
