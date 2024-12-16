import { Token } from '@lumino/coreutils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';
import { CellFooterWidget } from './widget';
import { findCell, findCellFooter } from './utils';

/**
 * A tracker useful for adding toolbar buttons to a Jupyterlab cell input footer.
 */
export const ICellFooterTracker = new Token<ICellFooterTracker>(
  'cellFooterTracker'
);

export interface ICellFooterTracker {
  getFooter(cellId?: string): CellFooterWidget | undefined;
  addItemOnLeft(options: CellFooterTracker.IOptions): void;
  addItemOnRight(options: CellFooterTracker.IOptions): void;
  hideFooter(cellId?: string): void;
  showFooter(cellId?: string): void;
}

export namespace CellFooterTracker {
  export interface IOptions {
    cellId: string | undefined;
    name: string;
    item: Widget;
  }
}

/**
 * A tracker useful for adding toolbar buttons to a Jupyterlab cell input footer.
 */
export class CellFooterTracker implements ICellFooterTracker {
  private _notebookTracker: INotebookTracker;

  constructor(notebookTracker: INotebookTracker) {
    this._notebookTracker = notebookTracker;
  }

  getFooter(cellId: string | undefined): CellFooterWidget | undefined {
    const id = cellId || this._notebookTracker.activeCell?.model.id;
    if (id === undefined) {
      return;
    }
    const { cell } = findCell(id, this._notebookTracker);
    if (!cell) {
      return;
    }
    return findCellFooter(cell);
  }

  /**
   * Adds a toolbar item to the left side of the footer toolbar
   *
   * @param options
   */
  addItemOnLeft(options: CellFooterTracker.IOptions) {
    const toolbar = this.getFooter(options.cellId);
    toolbar?.addItemOnLeft(options.name, options.item);
  }

  /**
   * Adds a toolbar item to the right side of the footer toolbar
   *
   * @param options
   */
  addItemOnRight(options: CellFooterTracker.IOptions) {
    const toolbar = this.getFooter(options.cellId);
    toolbar?.addItemOnRight(options.name, options.item);
  }

  /**
   * Hides the cell footer toolbar
   *
   * @param options
   */
  hideFooter(cellId: string | undefined): void {
    const toolbar = this.getFooter(cellId);
    toolbar?.hide();
  }

  /**
   * Shoes the cell footer toolbar
   *
   * @param options
   */
  showFooter(cellId: string | undefined): void {
    const toolbar = this.getFooter(cellId);
    toolbar?.show();
  }
}
