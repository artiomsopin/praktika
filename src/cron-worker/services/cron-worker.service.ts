import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronWorkerService implements OnModuleInit {
  private readonly logger = new Logger(CronWorkerService.name);

  constructor(private readonly scraperService: ScraperService) {}

  // This method is called when the module is initialized
  // To ensure that past records are saved, we run the scraper service
  onModuleInit() {
    this.runCronJob();
  }

  // Default to every day at 12:00 AM
  @Cron(process.env.CRON_JOB_SCHEDULE || '0 0 0 * * *', {
    timeZone: 'Europe/Vilnius',
  })
  async runCronJob() {
    try {
      await this.scraperService.scrapeData();
      this.logger.log('Cron job completed successfully.');
    } catch (error) {
      this.logger.error('Error during cron job execution:', error);
    }
  }
}
