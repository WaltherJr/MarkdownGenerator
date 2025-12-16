import { ListEditPanel } from './list-edit-panel.js';

export class UnorderedListEditPanel extends ListEditPanel {
    constructor(panelElement, document) {
        super(panelElement, document);
    }

    setup(document) {
        document.on('focusin', 'div#app-description ul', (event) => this.handleElementFocusEvent(event))
    }

    handleElementFocusEvent(event) {
        super.activate($(event.target));
    }
}
