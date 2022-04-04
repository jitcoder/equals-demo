import Engine from "./engine.js";

export interface ICell {
  key: string;
  display: string;
  value: string;
}

export default class SpreadSheet {
  private cells: { [key: string]: ICell } = {};
  private maxRow: number = 5;
  private maxColumn: number = 20;

  public engine: Engine = new Engine(this);

  get rowCount() {
    return this.maxRow;
  }

  get columnCount() {
    return this.maxColumn - 9;
  }

  public getCell(key: string) {
    if (key in this.cells) {
      return this.cells[key];
    } else {
      return { key, display: '', value: '' };
    }
  }

  public async setCell(key: string, value: string) {
    const keyMeta = this.parseKey(key);
    const rowNumber = Number(keyMeta.row);
    if (rowNumber > this.maxRow) {
      this.maxRow = rowNumber;
    }

    const columnNumber = Number.parseInt(keyMeta.column, 36);
    if (columnNumber > this.maxColumn) {
      this.maxColumn = columnNumber;
    }

    if (value.startsWith('=')) {
      // TODO: dependency graph here
      this.cells[key] = { key, display: await this.engine.execute(value), value };
    } else {
      this.cells[key] = { key, display: value, value };
    }
  }

  //A-Z [65-90]
  private parseKey(key: string) {
    let column = '';
    let row = '';
    for (let i = 0; i < key.length; i++) {
      const code = key.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        column += key.charAt(i);
      } else {
        row += key.charAt(i);
      }
    }

    return { column, row };
  }

  public getRange(range: string) {
    const [startKey, endKey] = range.split(':');
    const cells: ICell[] = [];

    const start = this.parseKey(startKey);
    const end = this.parseKey(endKey);

    const rowEnd = end.row ? Number(end.row) : this.maxRow;
    const rowStart = Number(start.row);

    const columnStart = Number.parseInt(start.column, 36);
    const columnEnd = Number.parseInt(end.column, 36);

    for (let c = columnStart; c < columnEnd + 1; c++) {
      for (let r = rowStart; r < rowEnd + 1; r++) {
        cells.push(this.getCell(`${c.toString(36).toUpperCase()}${r}`));
      }
    }


    return cells;
  }

  public getColumns() {
    const result = [];

    for (let c = 10; c < this.maxColumn; c++) {
      result.push(c.toString(36).toUpperCase());
    }

    return result;
  }

  public getRow(row: number) {
    const results = this.getColumns();

    if (row === 0) {
      return results;
    }

    return results.map((c) => `${c}${row}`);
  }

  toJSON() {
    return Object.values(this.cells);
  }

  static async fromJSON(cells: ICell[], register?: (sheet: SpreadSheet) => void) {
    const sheet = new SpreadSheet();

    if (register) {
      register(sheet);
    }

    for (const cell of cells) {
      await sheet.setCell(cell.key, cell.value);
    }

    return sheet;
  }
}