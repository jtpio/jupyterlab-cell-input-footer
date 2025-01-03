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
  addToolbarItemOnLeft(options: CellFooterTracker.IOptions): void;
  addToolbarItemOnRight(options: CellFooterTracker.IOptions): void;
  removeToolbarItem(options: CellFooterTracker.IOptions): void;
  hideFooter(cellId?: string): void;
  showFooter(cellId?: string): void;
}

export namespace CellFooterTracker {
  export interface IOptions {
    cellId: string | undefined;
    name: string;
    item?: Widget;
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
  addToolbarItemOnLeft(options: CellFooterTracker.IOptions) {
    const toolbar = this.getFooter(options.cellId);
    if (options.item) {
      toolbar?.addToolbarItemOnLeft(options.name, options.item);
    }
  }

  /**
   * Adds a toolbar item to the right side of the footer toolbar
   *
   * @param options
   */
  addToolbarItemOnRight(options: CellFooterTracker.IOptions) {
    const toolbar = this.getFooter(options.cellId);
    if (options.item) {
      toolbar?.addToolbarItemOnRight(options.name, options.item);
    }
  }

  /**
   * Removes a toolbar item from the cell footer.
   *
   * @param options
   */
  removeToolbarItem(options: CellFooterTracker.IOptions) {
    const toolbar = this.getFooter(options.cellId);
    toolbar?.removeToolbarItem(options.name);
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
