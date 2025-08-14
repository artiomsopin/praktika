import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CronWorkerModule } from 'src/cron-worker/cron-worker.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [PrismaModule, CronWorkerModule],
})
export class ApiModule {}
