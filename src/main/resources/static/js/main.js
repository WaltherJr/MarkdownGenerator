import * as utils from './utils.js';
import * as drag from './drag.js';
import * as i18n from './i18n.js';

const headingsSelector = [1,2,3,4,5,6].map(i => `.action-format-h${i}`).join(', ')
const appDescriptionImmediateChildrenSelector = 'div#app-description > *';

function generateMarkdown() {
    const appTitle = $('#app-name').val()
    const appDescription = $('#app-description').html();
/*  const markdownFooter = {
        assumed: $('#markdown-footer').val(),
        fallback: $('#markdown-footer').attr('placeholder')
    }
*/
    let markdownCode = '';

    markdownCode += `# ${appTitle}\n`;
    markdownCode += `${appDescription}`;
    // markdownCode += `---\n${markdownFooter.assumed ? markdownFooter.assumed : markdownFooter.fallback}`

    return markdownCode;
}

function fetchAllDocumentTranslations(forLanguageTag) {
    return utils.fetchData(`/?lang=${encodeURIComponent(forLanguageTag)}`, 'text').then((html, error) => {
        const parser = new DOMParser();
        const translatedDocument = parser.parseFromString(html, "text/html");
        let translations = {};

        translatedDocument.querySelectorAll('.has-i18n-text').forEach(element => {
            const elementSelector = utils.createSelectorForElement($(element), '');

            i18n.getElementI18NAttributeNames(element).map(i18nElementAttributeName => {
                if (translations[elementSelector] === undefined) {
                    translations[elementSelector] = {};
                }

                const translatedString = i18n.getElementI18NString(element, i18nElementAttributeName);
                translations[elementSelector][i18nElementAttributeName] = translatedString;
            });
        });

        return translations;
    });
}

$(document).ready(function() {
    $('button#generate-markdown').on('click', function() {
        const markdownHtml = generateMarkdown();
        const generatedMarkdown = marked.parse(markdownHtml);
        $('div#generated-markdown').html(generatedMarkdown);
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => console.log('Mutation detected:', mutation));
    });

    drag.addDragEvents(appDescriptionImmediateChildrenSelector);
    observer.observe(document.getElementById('app-description'), { childList: true, characterData: true, subtree: true });

    // TODO: Simplify "if (currentElement == stopElement || currentElement == document)"
    function findAncestorElement(stopElement, currentElement, tagNameToLookFor, matchingElement) {
         if (currentElement == stopElement) {
            console.log('[moveUpwardsInTheDOM] currentElement is the stop element!');
            return matchingElement;
         } else if (currentElement == document) {
            console.log('[moveUpwardsInTheDOM] currentElement is document element!');
            return matchingElement;
        } else {
            if (currentElement && currentElement.tagName && currentElement.tagName.toLowerCase() === tagNameToLookFor) {
                matchingElement = currentElement;
            }

            return findAncestorElement(stopElement, currentElement.parentElement, tagNameToLookFor, matchingElement);
        }
    }

    function setToolbarActiveButtons(toolbarButtons, selection, selectionRange) {
        console.log('Setting toolbar button states...');

        toolbarButtons.each(function(index, toolbarButton) {
            const button = $(toolbarButton);
            const surroundingElementLookedFor = button.attr('data-tag-name');

            if (surroundingElementLookedFor) {
                const surroundedByRequestedElement = findAncestorElement($('div#app-description-wrapper')[0], selection.baseNode, surroundingElementLookedFor, null);

                if (surroundedByRequestedElement) {
                    console.log("Requested element for tagName " + surroundingElementLookedFor + ": ", surroundedByRequestedElement);
                    if (button.hasClass('can-be-toggled')) {
                        button.addClass('state-pressed');
                    }
                } else {
                    button.removeClass('state-pressed');
                }
            }
        });
    }
    /*
    [[Range]]
    collapsed: false
    commonAncestorContainer: text
    endContainer: text
    endOffset: 17
    startContainer: text
    startOffset: 8

    [[Selection]]
    anchorNode: text
    anchorOffset: 8
    baseNode: text
    baseOffset: 8
    direction: "forward"
    extentNode: text
    extentOffset: 17
    focusNode: text
    focusOffset: 17
    isCollapsed: false
    rangeCount: 1
    type: "Range"
    */
    $(document).on('selectionchange', function(event) {
        console.log(event);
          const selection = document.getSelection();
          const selectionRange = selection.getRangeAt(0);
          const isWithinContentEditableArea = $(selection.anchorNode).closest('div#app-description').length > 0;
            // const activeElement = document.activeElement;

            console.log('WITHIN AREA: ', isWithinContentEditableArea);
            setToolbarActiveButtons($('ul#toolbar-2 button'), selection, selectionRange);

            if (isWithinContentEditableArea) {
                utils.setStoredSelectedElement(selection.anchorNode);
            }

            //console.log(selection);
            //console.log(selectionRange);

        const anchorNodeParentElement = selection.anchorNode.parentElement;

        if (anchorNodeParentElement.tagName.toLowerCase() === 'a') {
            // Editing a anchor element
            utils.setStoredSelectedElement(anchorNodeParentElement);
            utils.activatePanel($('#anchor-element-edit-panel'), $(anchorNodeParentElement));

        } else if (isWithinContentEditableArea) {
            utils.setStoredSelectedElement(null);
            utils.hideElement($('#anchor-element-edit-panel'));
        }
    }).on('focus', 'div#app-description img', function() {
        utils.setStoredSelectedElement($(this));
        utils.activatePanel($('#img-element-edit-panel'), $(this));

    }).on('focus', 'input#link-title, input#link-url', function() {
        const selectedElement = getStoredSelectedElement();
        utils.editElement(selectedElement);

    }).on('blur', 'input#link-title, input#link-url', function() {
        const selectedElement = getStoredSelectedElement();
        utils.uneditElement(selectedElement);

    }).on('click', 'button.action-format-bold', function() {
        utils.wrapElementWithTag('strong');

    }).on('click', 'button.action-format-italic', function() {
        utils.wrapElementWithTag('i');

    }).on('click', 'button.action-format-underlined', function() {
        utils.wrapElementWithTag('u');

    }).on('click', 'button.action-strikethrough-s', function() {
        utils.wrapElementWithTag('s');

    }).on('click', 'button.action-code', function() {
        utils.wrapElementWithTag('code');

    }).on('click', 'button.action-codes', function() {
        utils.wrapElementWithTag('pre');

    }).on('click', 'button.action-code-blocks', function() {
        utils.addElementToAppDescription($(document.createElement('pre')).attr({'data-floating-toolbar-name': 'first-floating-toolbar'}).text('Hello world!'));

    }).on('click', 'button.action-image', function() {
        utils.addElementToAppDescription($(document.createElement('img')).attr({'src': 'img/img0.jpg', 'alt': 'Image text', 'tabindex': '0'}));

    }).on('click', 'button.action-table', function() {
        const list = $(document.createElement('table'));
        list.append('<tr><td>Item 1, 1</td><td>Item 2, 1</td></tr><tr><td>Item 1, 2</td><td>Item 2, 2</td></tr>');
        utils.addElementToAppDescription(list);

    }).on('click', 'button.action-format-list-bulleted', function() {
        const list = $(document.createElement('ul'));
        list.append('<li>Item 1</li><li>Item 2</li>');
        utils.addElementToAppDescription(list);

    }).on('click', 'button.action-format-list-numbered', function() {
        const list = $(document.createElement('ol'));
        list.append('<li>Item 1</li><li>Item 2</li>');
        utils.addElementToAppDescription(list);

    }).on('click', 'button.action-horizontal-rule', function() {
        utils.addElementToAppDescription($(document.createElement('hr')).addClass('has-floating-toolbar').attr({'data-floating-toolbar-name': 'first-floating-toolbar'}));

    }).on('click', headingsSelector, function() {
        const headingLevel = 'h' + $(this).attr('class').match(/action-format-h([1-6])/)[1];
        wrapElementWithTag(headingLevel);

    }).on('mousedown', 'button', function() {
        if (!$(this).hasClass('can-be-toggled')) {
            $(this).addClass('state-pressed');
        }
    }).on('mouseup', 'button', function() {
        if (!$(this).hasClass('can-be-toggled')) {
            $(this).removeClass('state-pressed');
        }
    }).on('mouseover', '.has-floating-toolbar', function() {
        const pageOffset = $(this).offset();
        const toolbarName = $(this).attr('data-floating-toolbar-name');
        const toolbar = $(`.floating-toolbar#${toolbarName}`);
        const elementWidth = $(this).outerWidth(true);

        toolbar.removeClass('not-displayed').css({'right': Math.round(pageOffset.left - elementWidth), 'top': pageOffset.top})
            .siblings('.floating-toolbar').addClass('not-displayed').css({'left': '', 'right': '', 'top': ''});

    }).on('mouseout', '.has-floating-toolbar', function() {
        const toolbarName = $(this).attr('data-floating-toolbar-name');
        const toolbar = $(`.floating-toolbar#${toolbarName}`);

        toolbar.addClass('not-displayed').css({'left': '', 'right': '', 'top': ''});

    }).on('input', 'input[data-bind-attribute]', function() {
        const editedElement = utils.getEditedElement($(this).closest('.edit-panel'));
        const editedAttribute = $(this).attr('data-bind-attribute');

        if (editedElement) {
            $(editedElement).removeClass('update-animation');
            void editedElement.offsetWidth; // force reflow
            $(editedElement).addClass('update-animation').attr(editedAttribute, $(this).val());
        }
    });

    Promise.all($('select#selected-language-list > option').map((index, optionElement) => fetchAllDocumentTranslations($(optionElement).val()))).then(values => {
        console.log('DONE!');
    });

});