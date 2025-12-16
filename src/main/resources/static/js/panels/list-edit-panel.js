import { EditPanel } from './edit-panel.js';

export class ListEditPanel extends EditPanel {
    constructor(panelElement, document) {
        super(panelElement, document);
    }

    setup(document) {
        document.on('focusin', 'div#app-description ul, div#app-description ol', (event) => this.handleElementFocusEvent(event))
    }

    handleElementFocusEvent(event) {
        super.activate($(event.target));
    }
}
