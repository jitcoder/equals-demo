import * as React from "react";
import { ReactGrid, Column, Row, HeaderCell, CellChange } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./App.css";
import { useStore } from '@jitcoder/usestore';
import SpreadSheet from "@equals-demo/engine";
import { loadSheet } from "./api";
import { ISheetCell, SheetCellTemplate } from "./sheet-cell";

const getColumns = (sheet: SpreadSheet): Column[] => {
  return sheet
    .getColumns()
    .map((c: string) => {
      return { columnId: c, width: 200 }
    });
}

const getRows = (sheet: SpreadSheet): Row[] => {
  const results: Row<ISheetCell | HeaderCell>[] = [];

  for (let r = 0; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);

    if (r === 0) {
      results.push({
        rowId: 'headers',
        cells: row.map(r => {
          return { type: 'header', text: r };
        })
      });
    } else {
      results.push({
        rowId: r,
        cells: row.map(key => {
          const cell = sheet.getCell(key);
          return { type: 'sheet', display: String(cell.display), text: String(cell.value) };
        })
      })
    }
  }

  return results as Row[];
}

loadSheet();

export default function App() {
  const [sheet] = useStore<SpreadSheet>('app.sheet');
  const [renderCount, setRenderCount] = React.useState(0);

  const rows = getRows(sheet);
  const columns = getColumns(sheet);

  const handleChanges = async (changes: CellChange[]) => {  
    for (const change of (changes as CellChange<ISheetCell | HeaderCell>[])) {
      await sheet.setCell(`${change.columnId}${change.rowId}`, change.newCell.text);
    }
  
    setRenderCount(renderCount + 1);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactGrid
        rows={rows}
        columns={columns}
        enableFullWidthHeader
        enableFillHandle
        enableRangeSelection
        stickyTopRows={1}
        customCellTemplates={{ sheet: new SheetCellTemplate() }}
        onCellsChanged={handleChanges}
      />
    </div>
  );
}
