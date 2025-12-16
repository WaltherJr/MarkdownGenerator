import { EditPanel } from './edit-panel.js';

export class TableEditPanel extends EditPanel {
    constructor(panelElement, document) {
        super(panelElement, document);
    }

    setup(document) {
        document.on('click', 'div#app-description table', (event) => this.handleElementFocusEvent(event));
    }

    handleElementFocusEvent(event) {
        super.activate($(event.target).closest('table'));
    }
}
