import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ApiController],
  providers: [ApiService],
  imports: [PrismaModule],
})
export class ApiModule {}
