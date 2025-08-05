import { Injectable } from '@nestjs/common';
import { Frame, Page } from 'puppeteer';
import { RowFields } from '../interfaces/row-fields.interface';

@Injectable()
export class TableExtractorService {
  private readonly basePvsUrl = process.env.PVS_URL || '';
  private readonly targetFrameUrlPath = `${this.basePvsUrl}/ord/file:^Analize/LK/Vedinimas/AHU1|view:hx:HxDirectoryList|view:?fullScreen=true`;

  public async extract(page: Page): Promise<RowFields[]> {
    const targetFrame = this.getTargetFrame(page);
    if (!targetFrame) {
      throw new Error('Target frame not found');
    }

    const tableData = await this.getTableData(targetFrame);
    if (!tableData || tableData.length === 0) {
      throw new Error('No data found in the table');
    }

    return tableData;
  }

  // Find the target frame by URL path where the table is located
  private getTargetFrame(page: Page): Frame | null {
    const targetFrame = page
      .frames()
      .find((frame) => frame.url().includes(this.targetFrameUrlPath));
    return targetFrame || null;
  }

  private async getTableData(targetFrame: Frame): Promise<RowFields[]> {
    const tableData = await targetFrame.evaluate(() => {
      // TODO: Check typing
      const table: HTMLTableElement | null =
        document.querySelector('table.table');
      if (!table) throw new Error('Table not found');

      const fieldNames = [
        'fileName',
        'fileType',
        'fileSize',
        'timestamp',
      ] as const;

      const rows = Array.from(table.rows).map((row) => {
        const cells = Array.from(row.cells).map((cell) =>
          cell.innerText.trim(),
        );

        // Make objects from field names and cell values
        return Object.fromEntries(fieldNames.map((key, i) => [key, cells[i]]));
      });

      return rows as unknown as RowFields[];
    });
    return tableData;
  }
}
