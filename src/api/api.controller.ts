import { Controller, Get, HttpStatus, Query, HttpCode } from '@nestjs/common';
import { ApiService } from './api.service';
import { ContentQueryParams } from './interfaces/content-query-params.interface';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('api')
@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @ApiOperation({
    summary:
      'Fetch all content with optional field selection and timestamp filtering',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Comma-separated list of content fields to return',
    example: 'rekuperatorius_value_perc,griztamo_v_temp_value_celsius',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    description: "Start timestamp (Format: 'dd-MMM-yy h:mm:ss a z')",
    example: '14-Aug-25%2012:00:00%20AM%20EEST',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    description: "End timestamp (Format: 'dd-MMM-yy h:mm:ss a z')",
    example: '14-Aug-25%2012:06:00%20AM%20EEST',
  })
  @HttpCode(HttpStatus.OK)
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
}
