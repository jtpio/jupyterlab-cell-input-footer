import { Panel, Widget } from '@lumino/widgets';

import { ToolbarButton, closeIcon, Toolbar } from '@jupyterlab/ui-components';

export const CELL_FOOTER_ID = 'jp-cellfooter';

export class CellFooterWidget extends Panel {
  toolbar: Toolbar | undefined;

  constructor() {
    super();
    this.id = CELL_FOOTER_ID;
    this.addClass(CELL_FOOTER_ID);
    this.toolbar = new Toolbar();
    this.toolbar.addClass('jp-cellfooter-toolbar');
    this.toolbar.addItem('spacer', Toolbar.createSpacerItem());
    // const that = this;
    this.toolbar.addItem(
      'clear',
      new ToolbarButton({
        icon: closeIcon,
        enabled: true,
        onClick: () => {
          this.hide();
        }
      })
    );
    this.addWidget(this.toolbar);
  }

  addItemOnLeft(name: string, item: Widget) {
    this.toolbar?.insertBefore('spacer', name, item);
  }

  addItemOnRight(name: string, item: Widget) {
    this.toolbar?.insertBefore('clear', name, item);
  }
}
