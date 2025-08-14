import { Module } from '@nestjs/common';
import { CronWorkerService } from './services/cron-worker.service';
import { ScraperService } from './services/scraper.service';
import { CsvAggregatorService } from './services/csv-aggregator.service';
import { TableExtractorService } from './services/table-extractor.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [
    CronWorkerService,
    ScraperService,
    CsvAggregatorService,
    TableExtractorService,
  ],
  imports: [PrismaModule],
  exports: [CsvAggregatorService],
})
export class CronWorkerModule {}
