import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { ParsedCSV } from '../interfaces/parsed-csv.interface';
import { parse } from 'csv-parse/sync';

@Injectable()
export class CsvAggregatorService {
  public async fetchCsvFileRecords(
    page: Page,
    csvUrl: string,
  ): Promise<ParsedCSV[]> {
    const csvContent = await this.getCsvData(csvUrl, page);
    const records = this.parseCsvData(csvContent);
    return records;
  }

  private async getCsvData(url: string, page: Page): Promise<string> {
    const csvContent = await page.evaluate(async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch CSV file');
      return await res.text();
    }, url);

    return csvContent;
  }

  private parseCsvData(csvContent: string): ParsedCSV[] {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return records as ParsedCSV[];
  }
}
