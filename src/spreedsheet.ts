import Engine from "./engine.js";

interface ICell {
  display: string;
  value: string;
}

export default class SpreedSheet {
  private cells: { [key: string]: ICell } = {};
  private maxRow: number = 0;
  public engine: Engine = new Engine(this);

  public getCell(key: string) {
    return this.cells[key];
  }

  public async setCell(key: string, value: string) {
    const keyMeta = this.parseKey(key);
    const rowNumber = Number(keyMeta.row);
    if (rowNumber > this.maxRow) {
      this.maxRow = rowNumber;
    }

    if (value.startsWith('=')) {
      this.cells[key] = { display: await this.engine.execute(value), value };
    } else {
      this.cells[key] = { display: value, value };
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

    for (let r = rowStart; r < rowEnd + 1; r++) {
      cells.push(this.getCell(`${start.column}${r}`));
    }

    return cells;
  }
}