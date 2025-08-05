import { Module } from '@nestjs/common';
import { CronWorkerService } from './services/cron-worker.service';
import { ScraperService } from './services/scraper.service';
import { CsvAggregatorService } from './services/csv-aggregator.service';

@Module({
  providers: [CronWorkerService, ScraperService, CsvAggregatorService],
})
export class CronWorkerModule {}
