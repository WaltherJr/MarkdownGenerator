import { EditPanel } from './edit-panel.js';

export class ImageEditPanel extends EditPanel {
    constructor(panelElement, document) {
        super(panelElement, document);
    }

    setup(document) {
        document.on('focus', 'div#app-description img', (event) => this.handleElementFocusEvent(event));
    }

    handleElementFocusEvent(event) {
        debugger;
        super.activate($(event.target));
    }

    // TODO: use 2 images (animate width and height)
    setEditedElement(imageElement) {
        // super(imageElement);

        imageElement.css({width: imageElement.width() + 'px', height: imageElement.height() + 'px', outline: '2px solid red'});
        imageElement.off('load');
        imageElement.get(0).addEventListener('load', function(event) {
            handleImageOnLoadEvent(event, $(this));
        });
    }
}
