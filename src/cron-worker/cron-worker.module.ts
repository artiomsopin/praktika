import { Module } from '@nestjs/common';
import { CronWorkerService } from './services/cron-worker.service';
import { ScraperService } from './services/scraper.service';
import { CsvAggregatorService } from './services/csv-aggregator.service';
import { TableExtractorService } from './services/table-extractor.service';

@Module({
  providers: [
    CronWorkerService,
    ScraperService,
    CsvAggregatorService,
    TableExtractorService,
  ],
})
export class CronWorkerModule {}
