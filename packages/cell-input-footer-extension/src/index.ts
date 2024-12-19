import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IEditorServices } from '@jupyterlab/codeeditor';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { ContentFactoryWithFooter } from 'jupyterlab-cell-input-footer';

import {
  CellFooterTracker,
  ICellFooterTracker
} from 'jupyterlab-cell-input-footer';

/**
 * The notebook cell factory provider.
 */
const cellFactory: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
  id: 'jupyterlab-cell-input-footer:factory',
  provides: NotebookPanel.IContentFactory,
  requires: [IEditorServices],
  autoStart: true,
  activate: (app: JupyterFrontEnd, editorServices: IEditorServices) => {
    console.log('JupyterLab Plugin activated: jupyterlab-cellfooter:factory');

    const editorFactory = editorServices.factoryService.newInlineEditor;
    return new ContentFactoryWithFooter({ editorFactory });
  }
};

/**
 *
 */
const commands: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-cell-input-footer:commands',
  requires: [ICellFooterTracker],
  autoStart: true,
  activate: (app: JupyterFrontEnd, cellFooterTracker: ICellFooterTracker) => {
    console.log('JupyterLab Plugin activated: jupyterlab-cellfooter:commands');

    app.commands.addCommand('show-cell-footer', {
      execute: args => {
        cellFooterTracker.showFooter();
      }
    });

    app.commands.addKeyBinding({
      command: 'show-cell-footer',
      args: {},
      keys: ['Shift Cmd M'],
      selector: '.jp-Notebook'
    });
  }
};

const token: JupyterFrontEndPlugin<ICellFooterTracker> = {
  id: 'jupyterlab-cell-input-footer:token',
  description: 'Plugin that provides a Cell Footer Toolbar Tracker.',
  requires: [INotebookTracker],
  provides: ICellFooterTracker,
  autoStart: true,
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    console.log('jupyterlab-cell-input-footer activated!');
    return new CellFooterTracker(notebookTracker);
  }
};

export default [cellFactory, commands, token];
