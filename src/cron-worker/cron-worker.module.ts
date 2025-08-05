import { Module } from '@nestjs/common';
import { CronWorkerService } from './services/cron-worker.service';
import { ScraperService } from './services/scraper.service';
import { CsvParserService } from './services/csv-parser.service';

@Module({
  providers: [CronWorkerService, ScraperService, CsvParserService],
})
export class CronWorkerModule {}
