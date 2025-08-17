import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ContentSelector } from 'src/prisma/interfaces/content-selector.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllContentFieldsSelected } from './constants/all-content-fields-selected.constant';
import { ContentQueryParams } from './interfaces/content-query-params.interface';
import { CsvAggregatorService } from 'src/cron-worker/services/csv-aggregator.service';
import { CleanedSearchTimestamps } from './interfaces/cleaned-search-timestamps.interface';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  private readonly validContentFields = Object.keys(AllContentFieldsSelected);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly csvAggregatorService: CsvAggregatorService,
  ) {}

  async getAllContent(params: ContentQueryParams) {
    let select: Partial<ContentSelector>;

    try {
      if (!params.contentFields) {
        select = AllContentFieldsSelected;
      } else {
        select = this.getSelectedFields(params.contentFields);
      }
    } catch (error) {
      this.logger.error('Error parsing content fields', error.message);
      throw new BadRequestException('Invalid content fields format');
    }

    let timestamps: CleanedSearchTimestamps | undefined = undefined;
    try {
      const cleanedTimestamps = this.getCleanedTimestamps(params);
      // If timestamps are provided, we use them
      // If not, we leave timestamps undefined to fetch all content
      if (Object.keys(cleanedTimestamps).length > 0) {
        timestamps = cleanedTimestamps;
      }
    } catch (error) {
      this.logger.error('Error parsing timestamps', error);
      throw new BadRequestException('Invalid timestamp format');
    }

    return await this.prismaService.getAllContent(select, timestamps);
  }

  private getSelectedFields(contentFields: string): Partial<ContentSelector> {
    const selectedFields: Partial<ContentSelector> = contentFields
      .split(',')
      .map((f) => f.trim())
      .reduce((acc, field) => {
        this.validateField(field);
        acc[field] = true;
        return acc;
      }, {});
    this.logger.debug('Content selector:', JSON.stringify(selectedFields));
    return selectedFields;
  }

  private validateField(field: string) {
    if (!this.validContentFields.includes(field)) {
      this.logger.warn(`Invalid field requested: ${field}`);
      throw new BadRequestException(
        `Invalid field requested: ${field}. Valid fields are: ${this.validContentFields.join(', ')}`,
      );
    }
  }

  private getCleanedTimestamps(
    params: ContentQueryParams,
  ): CleanedSearchTimestamps {
    const cleanedTimestamp: CleanedSearchTimestamps = {};

    if (params.fromTimestamp) {
      const fromDate = this.csvAggregatorService.csvIsoFormatToDate(
        params.fromTimestamp,
      );
      this.logger.debug(`Parsed fromTimestamp: ${fromDate.toISOString()}`);
      cleanedTimestamp.from = fromDate;
    }

    if (params.toTimestamp) {
      const toDate = this.csvAggregatorService.csvIsoFormatToDate(
        params.toTimestamp,
      );
      this.logger.debug(`Parsed toTimestamp: ${toDate.toISOString()}`);
      cleanedTimestamp.to = toDate;
    }

    return cleanedTimestamp;
  }
}
