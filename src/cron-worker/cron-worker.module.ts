import { Module } from '@nestjs/common';
import { CronWorkerService } from './services/cron-worker.service';
import { ScraperService } from './services/scraper.service';

@Module({
  providers: [CronWorkerService, ScraperService],
})
export class CronWorkerModule {}
