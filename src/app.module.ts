import { Module } from '@nestjs/common';
import { CronWorkerModule } from './cron-worker/cron-worker.module';

@Module({
  imports: [CronWorkerModule],
})
export class AppModule {}
