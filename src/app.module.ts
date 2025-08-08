import { Module } from '@nestjs/common';
import { CronWorkerModule } from './cron-worker/cron-worker.module';
import { PrismaModule } from './prisma/prisma.module';
import { ApiModule } from './api/api.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CronWorkerModule,
    PrismaModule,
    ApiModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
