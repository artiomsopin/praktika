import { Injectable } from '@nestjs/common';
import puppeteer, { Frame, Page } from 'puppeteer';
import { Credentials } from '../interfaces/credentials.interface';
import { TableExtractorService } from './table-extractor.service';

@Injectable()
export class ScraperService {
  constructor(private readonly tableExtractorService: TableExtractorService) {}

  // Configuration for Puppeteer to scrape data from PVS
  private readonly credentials: Credentials = {
    login: process.env.PVS_LOGIN || '',
    pass: process.env.PVS_PASSWORD || '',
  };
  private readonly basePvsUrl = process.env.PVS_URL || '';
  private readonly csvFilesUrlPath = `${this.basePvsUrl}/ord/file:^Analize/LK/Vedinimas/AHU1|view:hx:HxDirectoryList`;
  private readonly fileRootUrl = '/ord?file:^Analize/LK/Vedinimas/AHU1/';

  async scrapeData() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(`${this.basePvsUrl}/login`);
    await this.authenticateUser(page, this.credentials);

    await page.goto(this.csvFilesUrlPath);

    const tableData = await this.tableExtractorService.extract(page);

    // await browser.close();
  }

  private async authenticateUser(page: Page, credentials: Credentials) {
    await this.enterLogin(page, credentials.login);
    await this.enterPassword(page, credentials.pass);
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
}
