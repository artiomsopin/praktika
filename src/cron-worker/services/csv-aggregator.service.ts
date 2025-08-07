import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import { ParsedCSV } from '../interfaces/parsed-csv.interface';
import { parse } from 'csv-parse/sync';
import { DateTime } from 'luxon';
import { ContentEntity } from 'src/prisma/entities/content.entity';
import { ParsedCSVFields } from '../constants/parsed-csv-fields.enum';

@Injectable()
export class CsvAggregatorService {
  private readonly fileRootUrl = '/ord?file:^Analize/LK/Vedinimas/AHU1/';
  private readonly csvDateFormat = 'dd-MMM-yy h:mm:ss a z';

  public async getCsvParsedRecords(
    page: Page,
    fileName: string,
  ): Promise<ParsedCSV[]> {
    const csvFileUrl = `${this.fileRootUrl}${fileName}`;
    const csvContent = await this.getCsvPlainData(csvFileUrl, page);
    return this.parseCsvData(csvContent);
  }

  public csvIsoFormatToDate(isoDate: string): Date {
    const formatWithSeconds = 'dd-MMM-yy h:mm:ss a';
    const formatWithoutSeconds = 'dd-MMM-yy h:mm a';

    const cleanedDate = this.cleanDate(isoDate);

    let dt = DateTime.fromFormat(cleanedDate, formatWithSeconds, {
      zone: 'Europe/Vilnius',
    });

    if (!dt.isValid) {
      dt = DateTime.fromFormat(cleanedDate, formatWithoutSeconds, {
        zone: 'Europe/Vilnius',
      });
    }

    if (!dt.isValid) {
      throw new Error(`Invalid date format: ${isoDate}`);
    }
    return dt.toJSDate();
  }

  private cleanDate(isoDate: string): string {
    // Remove timezone information if present
    const lastSpaceIndex = isoDate.lastIndexOf(' ');
    return lastSpaceIndex !== -1
      ? isoDate.substring(0, lastSpaceIndex).trim()
      : isoDate;
  }

  // Converts parsed CSV records to ContentEntity format
  // This is used to save the records in the database
  public formatCsvRecords(records: ParsedCSV[]): ContentEntity[] {
    const formattedRecords: ContentEntity[] = records.map((record) => {
      const formattedRecord: ContentEntity = {
        timestamp: this.csvIsoFormatToDate(record.timestamp),
        uzd_temp_value_celsius: Number(record[ParsedCSVFields.UzdTemp]),
        sildymas_value_perc: Number(record[ParsedCSVFields.Sildymas]),
        rekuperatorius_value_perc: Number(
          record[ParsedCSVFields.Rekuperatorius],
        ),
        temp_rezimas_value: Number(record[ParsedCSVFields.TempRezimas]),
        istraukiama_temp_value_celsius: Number(
          record[ParsedCSVFields.IstraukiamaTemp],
        ),
        tiekiama_temp_value_celsius: Number(
          record[ParsedCSVFields.TiekiamaTemp],
        ),
        ismetama_temp_value_celsius: Number(
          record[ParsedCSVFields.IsmetamaTemp],
        ),
        griztamo_v_temp_value_celsius: Number(
          record[ParsedCSVFields.GriztamoVTemp],
        ),
        lauko_temp_value_celsius: Number(record[ParsedCSVFields.LaukoTemp]),
        saldymas_value_perc: Number(record[ParsedCSVFields.Saldymas]),
        istraukiamas_srautas_value_m3_hr: Number(
          record[ParsedCSVFields.IstraukiamasSrautas],
        ),
        tiekimo_vent_value_perc: Number(record[ParsedCSVFields.TiekimoVent]),
        tiekimas_srautas_value_m3_hr: Number(
          record[ParsedCSVFields.TiekimasSrautas],
        ),
        istraukimo_vent_value_perc: Number(
          record[ParsedCSVFields.IstraukimoVent],
        ),
      };
      return formattedRecord;
    });

    return formattedRecords;
  }

  private async getCsvPlainData(url: string, page: Page): Promise<string> {
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
