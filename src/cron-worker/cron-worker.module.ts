import { Module } from '@nestjs/common';
import { CronWorkerService } from './services/cron-worker.service';
import { ScraperService } from './services/scraper.service';
import { CsvAggregatorService } from './services/csv-aggregator.service';
import { TableExtractorService } from './services/table-extractor.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [
    CronWorkerService,
    ScraperService,
    CsvAggregatorService,
    TableExtractorService,
  ],
  imports: [PrismaModule, ScheduleModule.forRoot()],
})
export class CronWorkerModule {}
