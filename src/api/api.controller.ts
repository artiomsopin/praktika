import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { ContentQueryParams } from './interfaces/content-query-params.interface';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('content')
  async getAllContentByFields(
    @Query('fields') contentFields?: string,
    @Query('from') fromTimestamp?: string, // Format: 'dd-MMM-yy h:mm:ss a z'
    @Query('to') toTimestamp?: string, // Same format as fromTimestamp
  ) {
    const params: ContentQueryParams = {
      contentFields,
      fromTimestamp,
      toTimestamp,
    };
    return this.apiService.getAllContent(params);
  }

  @Get('health')
  async healthCheck() {
    return await this.apiService.healthCheck();
  }
}
