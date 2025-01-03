import { Panel, Widget } from '@lumino/widgets';

import { ToolbarButton, closeIcon, Toolbar } from '@jupyterlab/ui-components';
import { find, map } from '@lumino/algorithm';

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

  addToolbarItemOnLeft(name: string, item: Widget) {
    this.toolbar?.insertBefore('spacer', name, item);
  }

  addToolbarItemOnRight(name: string, item: Widget) {
    this.toolbar?.insertBefore('clear', name, item);
  }

  removeToolbarItem(name: string) {
    if (!this.toolbar) {
      return;
    }
    const nameWithWidget = map(this.toolbar.names(), (widgetName, i) => {
      return { name: widgetName, index: i };
    });
    const item = find(nameWithWidget, x => x.name === name);
    if (!item) {
      return;
    }
    const widget = [...this.toolbar.children()][item.index];
    // Dispose of the widget
    widget.dispose();
  }

  removeWidget(className: string) {
    const widget = this.widgets.find(w => w.hasClass(className));
    widget?.dispose();
  }
}
