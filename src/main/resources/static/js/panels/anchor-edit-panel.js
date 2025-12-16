import { EditPanel } from './edit-panel.js';
import * as utils from '../utils.js';

export class AnchorEditPanel extends EditPanel {
    constructor(panelElement, document) {
        super(panelElement, document);
    }

    setup(document) {
        // TODO: can't use focus or focusin?
        document.on('click', 'div#app-description a', (event) => this.handleElementFocusEvent(event));
        /*    .on('focus', 'input#link-title, input#link-url', function() {
            // const selectedElement = getStoredSelectedElement();
            // utils.editElement(selectedElement);

        }).on('blur', 'input#link-title, input#link-url', function() {
            // const selectedElement = getStoredSelectedElement();
            // utils.uneditElement(selectedElement);
        });*/
    }

    handleElementFocusEvent(event) {
        debugger;
        super.activate($(event.target));
    }
}