import { Module } from '@nestjs/common';
import { CronWorkerModule } from './cron-worker/cron-worker.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [CronWorkerModule, PrismaModule],
})
export class AppModule {}
