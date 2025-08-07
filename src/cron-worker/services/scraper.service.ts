import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Frame, Page } from 'puppeteer';
import { Credentials } from '../interfaces/credentials.interface';
import { TableExtractorService } from './table-extractor.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TableRowFields } from '../interfaces/row-fields.interface';
import { FileEntity } from 'src/prisma/entities/file.entity';
import { CsvAggregatorService } from './csv-aggregator.service';
import { ContentEntity } from 'src/prisma/entities/content.entity';

@Injectable()
export class ScraperService {
  constructor(
    private readonly tableExtractorService: TableExtractorService,
    private readonly prismaService: PrismaService,
    private readonly csvAggregatorService: CsvAggregatorService,
  ) {}
  private readonly logger = new Logger(ScraperService.name);

  // Configuration for Puppeteer to scrape data from PVS
  private readonly credentials: Credentials = {
    login: process.env.PVS_LOGIN || '',
    pass: process.env.PVS_PASSWORD || '',
  };
  private readonly basePvsUrl = process.env.PVS_URL || '';
  private readonly csvFilesUrlPath = `${this.basePvsUrl}/ord/file:^Analize/LK/Vedinimas/AHU1|view:hx:HxDirectoryList`;

  async scrapeData() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(`${this.basePvsUrl}/login`);
    await this.authenticateUser(page, this.credentials);

    await page.goto(this.csvFilesUrlPath);

    const tableData = await this.tableExtractorService.extract(page);
    this.logger.log(`Extracted ${tableData.length} rows from the table.`);

    const newFiles = await this.getNewFiles(tableData);
    if (newFiles.length === 0) {
      this.logger.log('No new files to save.');
      await browser.close();
      return;
    }

    await this.saveNewFiles(newFiles, page);

    // await browser.close();
  }

  private async authenticateUser(page: Page, credentials: Credentials) {
    await this.enterLogin(page, credentials.login);
    await this.enterPassword(page, credentials.pass);
    this.logger.log('User authenticated successfully');
  }

  private async enterLogin(page: Page, login: string) {
    await page.type('input[name="j_username"]', login);
    await page.keyboard.press('Enter');
    await this.waitFullPageLoad(page);
  }

  private async enterPassword(page: Page, password: string) {
    const passwordSelector = 'input[name="j_password"]';
    await page.waitForSelector(passwordSelector, { visible: true });

    await page.type(passwordSelector, password);
    await page.keyboard.press('Enter');

    await this.waitFullPageLoad(page);
  }

  private async waitFullPageLoad(page: Page) {
    // Wait for the network to be fully idle
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
  }

  private async getNewFiles(
    tableData: TableRowFields[],
  ): Promise<TableRowFields[]> {
    const existingFiles = await this.prismaService.getAllExistingFiles();
    this.logger.debug(`Found ${existingFiles.length} existing files.`);

    const newFiles = tableData.filter((row) => {
      return !existingFiles.some((file) => file.file_name === row.name);
    });
    this.logger.debug(`Found ${newFiles.length} new files to save.`);
    return newFiles;
  }

  private async saveNewFiles(
    files: TableRowFields[],
    page: Page,
  ): Promise<void> {
    for (const file of files) {
      this.logger.debug(`Processing file: ${JSON.stringify(file)}`);
      const contentRecords =
        await this.csvAggregatorService.getCsvParsedRecords(page, file.name);

      const formattedContent: ContentEntity[] =
        this.csvAggregatorService.formatCsvRecords(contentRecords);

      const fileEntity: FileEntity = this.formatFileEntity(
        file,
        formattedContent,
      );
      await this.prismaService.saveNewFile(fileEntity);
    }
  }

  private formatFileEntity(
    file: TableRowFields,
    content: ContentEntity[],
  ): FileEntity {
    const fileEntity: FileEntity = {
      file_name: file.name,
      file_type: file.type,
      size: file.size,
      modified: this.csvAggregatorService.csvIsoFormatToDate(file.modified),
      content: undefined,
    };
    this.logger.debug(`Formatted file entity: ${JSON.stringify(fileEntity)}`);
    return fileEntity;
  }
}
