import * as utils from './utils.js';

export class SelectList {
    static setup(document) {
        document.on('click', '.html-list-wrapper ul.html-list-top-list > li', (event) => document.selectLists.handleClickEvent($(event.currentTarget), event))
                .on('wheel', '.html-list-wrapper', (event) => document.selectLists.handleWheelEvent($(event.currentTarget), event.originalEvent))
                .on('blur', '.html-list-wrapper', (event) => document.selectLists.handleBlurEvent($(event.currentTarget), event.originalEvent));

        document.find('.html-list-wrapper').each(function(index, element) {
            $(element).css('width', Math.round($(this).find('ul.html-list-top-list').outerWidth(true)) + 'px');
        });
    }

    handleWheelEvent(listWrapper, event) {
        const elementList = listWrapper.children('ul.html-list-top-list');
        const listSize = elementList.children('li').length;
        const selectedListItem = elementList.children('li.selected-item');
        const selectedItemIndex = selectedListItem.index() + 1;
        const scrollDirection = Math.sign(event.deltaY);
        const scrollCondition1 = (scrollDirection === -1 && selectedItemIndex > 1);
        const scrollCondition2 = (scrollDirection == 1 && selectedItemIndex < listSize);

        if (selectedListItem.length === 0) {
            const firstElementSelected = elementList.children('li:first-child').addClass('selected-item');
            listWrapper.children('span.list-selected-item').html(firstElementSelected.html());

        } else if (scrollCondition1 || scrollCondition2) {
            const elementSelected = $(elementList).children(`:nth-child(${selectedItemIndex + scrollDirection})`);
            elementSelected.addClass('selected-item').siblings('.selected-item').removeClass('selected-item');
            listWrapper.children('span.list-selected-item').html(elementSelected.html());
        }
    }

    handleBlurEvent(listWrapper, event) {
        listWrapper.removeClass('is-open');
    }

    handleClickEvent(listItem, event) {
        const selectedItemText = listItem.closest('.html-list-wrapper').children('* > .list-selected-item');
        selectedItemText.html(listItem.html());
        listItem.addClass('selected-item').siblings('.selected-item').removeClass('selected-item');
        listItem.closest('.html-list-wrapper').removeClass('is-open').trigger('change');
    }

    onActivationEvent() {
        /*
        utils.hideElement($('.edit-panel').not(this))
        utils.showElement($(this));
        */
    }

}
