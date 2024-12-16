import { 
  PanelLayout, 
  Widget
} from '@lumino/widgets';
import { 
  Notebook,
  NotebookPanel,
  INotebookTracker
} from '@jupyterlab/notebook';

import {
  Cell
} from '@jupyterlab/cells';

import { 
  CELL_FOOTER_ID,
  CellFooterWidget
} from './widget';

export function cellFromIndex(notebook: Notebook, idx: number): Cell | undefined { 
  let cellId = notebook.model?.cells.get(idx)?.id;
  if (cellId) {
    let cell = notebook._findCellById(cellId)?.cell;
    if (cell) {
      return cell;
    }
  }
}

export type ActiveNotebookCell = {
  cell: Cell | undefined;
  notebook: NotebookPanel | undefined;
}

export function findCell(cellId: string, notebookTracker: INotebookTracker): ActiveNotebookCell {
  // First, try the current notebook in focuse
  let currentNotebook = notebookTracker.currentWidget;
  let cell = notebookTracker.currentWidget?.content._findCellById(cellId)?.cell;
  if (currentNotebook && cell) {
    return {
      cell: cell,
      notebook: currentNotebook
    }
  } 

  // Otherwise iterate through notebooks to find the cell.
  let notebookMatch = notebookTracker.find((notebook) => {
    let cell = notebook.content._findCellById(cellId)?.cell
    if (cell) {
      return true;
    }
    return false
  })
  return {
    cell: cell, 
    notebook: notebookMatch
  }
}

export function findCellFooter(cell: Cell): CellFooterWidget | undefined {
  let layout = (cell?.layout as PanelLayout);
  // Dispose any old widgets attached to this cell.
  let oldWidget: Widget | undefined = layout.widgets.find((w) => w.id == CELL_FOOTER_ID);
  return (oldWidget as CellFooterWidget)
}