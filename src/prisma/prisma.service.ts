import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Content, File, PrismaClient } from 'generated/prisma';
import { FileEntity } from './entities/file.entity';
import { ContentSelector } from './interfaces/content-selector.interface';
import { CleanedSearchTimestamps } from 'src/api/interfaces/cleaned-search-timestamps.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
  }

  async getAllExistingFiles(): Promise<File[]> {
    return await this.file.findMany();
  }

  async saveNewFile(file: FileEntity): Promise<File> {
    return await this.file.create({
      data: {
        file_name: file.file_name,
        size: file.size,
        file_type: file.file_type,
        modified: file.modified,
        content: file.content ? { create: file.content } : undefined,
      },
    });
  }

  async getAllFiles(): Promise<File[]> {
    return await this.file.findMany({
      include: { content: false },
    });
  }

  async getFileByName(fileName: string): Promise<File | null> {
    return await this.file.findUnique({
      where: { file_name: fileName },
      include: { content: true },
    });
  }

  async getAllContent(
    selectedFields: Partial<ContentSelector>,
    cleanedTimestamps?: CleanedSearchTimestamps,
  ): Promise<Partial<Content>[]> {
    const dateFilter: any = {};

    if (cleanedTimestamps) {
      dateFilter.timestamp = {};
      if (cleanedTimestamps.from)
        dateFilter.timestamp.gte = cleanedTimestamps.from;
      if (cleanedTimestamps.to) dateFilter.timestamp.lte = cleanedTimestamps.to;
    }

    const allContent = await this.content.findMany({
      where: dateFilter,
      select: selectedFields,
    });
    this.logger.debug(`Found ${allContent.length} files with content.`);

    return allContent;
  }
}
