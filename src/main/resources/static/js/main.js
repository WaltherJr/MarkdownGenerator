import * as utils from './utils.js';
import * as drag from './drag.js';
import * as i18n from './i18n.js';
import { SelectList } from './select-list.js';
import { EditPanel } from './panels/edit-panel.js';
import { ImageEditPanel } from './panels/image-edit-panel.js';
import { AnchorEditPanel } from './panels/anchor-edit-panel.js';
import { ListEditPanel } from './panels/list-edit-panel.js';
import { UnorderedListEditPanel } from './panels/unordered-list-edit-panel.js';
import { OrderedListEditPanel } from './panels/ordered-list-edit-panel.js';
import { TableEditPanel } from './panels/table-edit-panel.js';

const headingsSelector = [1,2,3,4,5,6].map(i => `.action-format-h${i}`).join(', ')
const appDescriptionImmediateChildrenSelector = 'div#app-description > *';
document.selectLists = new SelectList();

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
    const $document = $(document);
    document.editPanels = {
        img: new ImageEditPanel($('#img-element-edit-panel'), $document),
        a: new AnchorEditPanel($('#a-element-edit-panel'), $document),
        ul: new UnorderedListEditPanel($('#ul-element-edit-panel'), $document),
        ol: new OrderedListEditPanel($('#ol-element-edit-panel'), $document),
        table: new TableEditPanel($('table-element-edit-panel'), $document)
    };

    // document.editPanels = Object.fromEntries(['a', 'img', 'ul', 'ol'].flatMap(elementName => [[elementName, new EditPanel($(`#${elementName}-element-edit-panel`))]]));

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

    function handleDocumentSelectionChangeEvent(event) {
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
    }

    function setToolbarActiveButtons(toolbarButtons, selection, selectionRange) {
        console.log('Setting toolbar button states...');

        toolbarButtons.each(function(index, toolbarButton) {
            const button = $(toolbarButton);
            const surroundingElementLookedFor = button.attr('data-tag-name');

            if (surroundingElementLookedFor) {
                const surroundedByRequestedElement = utils.findAncestorElement($('div#app-description-wrapper')[0], selection.baseNode, surroundingElementLookedFor, null);

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

    $(document).on('selectionchange', handleDocumentSelectionChangeEvent)
    .on('click', 'button.action-format-bold', function() {
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
        const currentLocale = i18n.getCurrentAppLanguage();
        const defaultImageAltText = document.app_config.i18nStrings.defaultImageAltText[currentLocale];
        utils.addElementToAppDescription($(document.createElement('img')).attr({'src': 'img/img0.jpg', 'alt': defaultImageAltText, 'tabindex': '0'}));

    }).on('click', 'button.action-table', function() {
        const currentLocale = i18n.getCurrentAppLanguage();
        const table = $(document.createElement('table'));
        const tableCaptionTranslation = document.app_config.i18nStrings.tableCaption[currentLocale];
        const headingTranslation = document.app_config.i18nStrings.values.heading;
        const cellTranslation = document.app_config.i18nStrings.values.cell;
        let tableHtml = `<caption>${tableCaptionTranslation}</caption><tr><th>${headingTranslation} 1</th><th>${headingTranslation} 2</th></tr>`;
        [1, 2].forEach(i => tableHtml += `<tr><td>${cellTranslation} ${i}, 1</td><td>${cellTranslation} ${i}, 2</td></tr>`);

        utils.addElementToAppDescription(table.append(tableHtml));

    }).on('click', 'button.action-format-list-bulleted', function() {
        const list = $('<ul tabindex="0"></ul>');
        list.append('<li>Item 1</li><li>Item 2</li>');
        utils.addElementToAppDescription(list);

    }).on('click', 'button.action-format-list-numbered', function() {
        const list = $('<ol tabindex="0"></ol>');
        list.append('<li>Item 1</li><li>Item 2</li>');
        utils.addElementToAppDescription(list);

    }).on('click', 'button.action-horizontal-rule', function() {
        utils.addElementToAppDescription($(document.createElement('hr')).addClass('has-floating-toolbar').attr({'data-floating-toolbar-name': 'first-floating-toolbar'}));

    }).on('click', headingsSelector, function() {
        const headingLevel = 'h' + $(this).attr('class').match(/action-format-h([1-6])/)[1];
        utils.wrapElementWithTag(headingLevel);

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

    }).on('input', 'input[data-bind-attribute]', (event) => handleEditElementAttributeInput.bind($(this).closest('edit-panel').get())($(event.currentTarget)))
    .on('change', '#set-list-style-type-list', (event) => handleEditElementAttributeInput.bind($(this).closest('edit-panel').get())($(event.currentTarget), 'text'))
    .on('click', '.html-list-wrapper', function() {
        const list = $(this);
        list.toggleClass('is-open');

/*
        if (list.hasClass('is-open')) {
            list.css('height', list.children('.html-list-top-list').outerHeight());
        } else {
            list.css('height', '');
        }
        */
    });

    Promise.all($('select#selected-language-list > option').map((index, optionElement) => fetchAllDocumentTranslations($(optionElement).val()))).then(values => {
        console.log('DONE!');
        document.i18nStrings = values;
    });

});