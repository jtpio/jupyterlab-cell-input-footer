import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IEditorServices } from '@jupyterlab/codeeditor';

import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';

import { ContentFactoryWithFooter } from './contentfactory';

import { CellFooterTracker, ICellFooterTracker } from './token';

/**
 * The notebook cell factory provider.
 */
const cellFactory: JupyterFrontEndPlugin<NotebookPanel.IContentFactory> = {
  id: 'jupyterlab-cellfooter:factory',
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
  id: 'jupyterlab-cellfooter:commands',
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
  id: 'jupyterlab-cellfooter:token',
  description: 'Plugin that provides a Cell Footer Toolbar Tracker.',
  requires: [INotebookTracker],
  provides: ICellFooterTracker,
  autoStart: true,
  activate: (app: JupyterFrontEnd, notebookTracker: INotebookTracker) => {
    console.log('JupyterLab Plugin activated: jupyterlab-cellfooter:token');
    return new CellFooterTracker(notebookTracker);
  }
};

export default [cellFactory, commands, token];
