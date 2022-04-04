import * as React from 'react';

// NOTE: all modules imported below may be imported from '@silevis/reactgrid'
import { isAlphaNumericKey, isNavigationKey } from '@silevis/reactgrid'
import { getCellProperty } from '@silevis/reactgrid';
import { keyCodes } from '@silevis/reactgrid';
import { Cell, CellTemplate, Compatible, Uncertain, UncertainCompatible } from '@silevis/reactgrid';
import { getCharFromKeyCode } from '@silevis/reactgrid';

export interface ISheetCell extends Cell {
  type: 'sheet';
  display: string;
  text: string;
}

export class SheetCellTemplate implements CellTemplate<ISheetCell> {

  getCompatibleCell(uncertainCell: Uncertain<ISheetCell>): Compatible<ISheetCell> {
    const text = getCellProperty(uncertainCell, 'text', 'string');
    const display = getCellProperty(uncertainCell, 'display', 'string');

    return { ...uncertainCell, display, text, value: NaN };
  }

  update(cell: Compatible<ISheetCell>, cellToMerge: UncertainCompatible<ISheetCell>): Compatible<ISheetCell> {
    return this.getCompatibleCell({ ...cell, text: cellToMerge.text, display: cellToMerge.display })
  }

  handleKeyDown(cell: Compatible<ISheetCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<ISheetCell>, enableEditMode: boolean } {
    const char = getCharFromKeyCode(keyCode, shift);
    if (!ctrl && !alt && isAlphaNumericKey(keyCode) && !(shift && keyCode === keyCodes.SPACE))
      return { cell: this.getCompatibleCell({ ...cell, text: shift ? char : char.toLowerCase() }), enableEditMode: true }
    return { cell, enableEditMode: keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER }
  }

  getClassName(cell: Compatible<ISheetCell>, isInEditMode: boolean): string {
    const className = cell.className ? cell.className : '';
    return `${className}`;
  }

  render(cell: Compatible<ISheetCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<ISheetCell>, commit: boolean) => void): React.ReactNode {
    if (!isInEditMode) {
      const textToDisplay = cell.display || cell.text;
      return textToDisplay;
    }

    return <input
      ref={input => {
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      }}
      defaultValue={cell.text}
      onChange={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), false)}
      onBlur={e => onCellChanged(this.getCompatibleCell({ ...cell, text: e.currentTarget.value }), true)}
      onCopy={e => e.stopPropagation()}
      onCut={e => e.stopPropagation()}
      onPaste={e => e.stopPropagation()}
      onPointerDown={e => e.stopPropagation()}
      onKeyDown={e => {
        if (isAlphaNumericKey(e.keyCode) || (isNavigationKey(e.keyCode))) e.stopPropagation();
      }}
    />
  }
}