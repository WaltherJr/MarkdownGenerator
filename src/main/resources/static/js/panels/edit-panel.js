import * as utils from './../utils.js';

export class EditPanel {
    constructor(panelElement, document) {
        this.panelElement = panelElement;
        this.setup(document);
    }
/*
    onActivationEvent() {
        utils.hideElement($('.edit-panel').not(this));
        utils.showElement($(this));
    }
*/
    activate(editedElement) {
    debugger;
        this.setEditedElement(editedElement); // Needs to be called first (img will not set width and height to original image if updating to non-edisting image src)
        const databindElements = this.panelElement.find('[data-bind-attribute]').toArray();

        for (const databindElement of databindElements) {
            const elementjQuery = $(databindElement);
            const databindDomain = elementjQuery.attr('data-bind-domain');
            const databindAttribute = elementjQuery.attr('data-bind-attribute');
            const targetElement = elementjQuery.hasClass('data-bind-input') ? elementjQuery : elementjQuery.find('.data-bind-input');
            const targetActivationHandler = (elementjQuery.attr('data-activation-handler') || '').split(/\./);
            const targetValue = editedElement[databindDomain](databindAttribute);

            targetElement[targetElement.is(':input') ? 'val' : 'text'](targetValue);
            this.panelElement.addClass('active-panel').siblings().removeClass('active-panel'); // utils.hideElement($('.edit-panel').not(this.panelElement));
            utils.showElement($(this.panelElement));

            if (targetActivationHandler) {
                const targetActivationHandlerCallback = document[targetActivationHandler[0]][targetActivationHandler[1]];
                targetActivationHandlerCallback.bind(databindElement)();
            }
        }
    }

    getEditedElement() {
        return this.panelElement.data('editedElement');
    }

    setEditedElement(editedElement) {
        this.panelElement.data('editedElement', editedElement);
    }

    handleEditElementAttributeInput(inputField, databindFunction = 'val') {
        inputField = inputField.hasClass('data-bind-input') ? inputField : inputField.find('.data-bind-input');
        const editedElement = this.getEditedElement(inputField.closest('.edit-panel'));
        const databindAttribute = inputField.attr('data-bind-attribute');
        const databindDomain = inputField.attr('data-bind-domain');

        if (editedElement) {
            $(editedElement).removeClass('update-animation');
            void editedElement.offsetWidth; // force reflow
            $(editedElement).addClass('update-animation');
            const elementAttributeValue = inputField[databindFunction]();
            $(editedElement)[databindDomain](databindAttribute, elementAttributeValue);
        }
    }
}
