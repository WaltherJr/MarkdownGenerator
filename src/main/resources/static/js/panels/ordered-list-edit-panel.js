import { ListEditPanel } from './list-edit-panel.js';

export class OrderedListEditPanel extends ListEditPanel {
    constructor(panelElement, document) {
        super(panelElement, document);
    }

    setup(document) {
        document.on('focusin', 'div#app-description ol', (event) => this.handleElementFocusEvent(event))
    }

    handleElementFocusEvent(event) {
        super.activate($(event.target));
    }
}
