const headingsSelector = [1,2,3,4,5,6].map(i => `.action-format-h${i}`).join(', ')
const appDescriptionImmediateChildrenSelector = 'div#app-description > *';

function escapeHtmlAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fetchData(url, responseHandler) {
    return fetch(url).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response[responseHandler]();
        })
        .catch(error => {
          console.error('Fetch error:', error);
    });
}

function generateMarkdown() {
    const appTitle = $('#app-name').val()
    const appDescription = $('#app-description').html();
    const markdownFooter = {
        assumed: $('#markdown-footer').val(),
        fallback: $('#markdown-footer').attr('placeholder')
    }

    let markdownCode = '';

    markdownCode += `# ${appTitle}\n`;
    markdownCode += `${appDescription}`;
    markdownCode += `---\n${markdownFooter.assumed ? markdownFooter.assumed : markdownFooter.fallback}`

    return markdownCode;
}

function addDragEvents() {
    $('body')
        .on('dragover', appDescriptionImmediateChildrenSelector, function(event) {
            event.preventDefault(); // Cancel dragover so that drop can fire
            const elementHeight = $(this).outerHeight();
            const elementOffset = $(this).offset();
            const relativeY = (elementOffset.top + elementHeight) - event.pageY;
            console.log(elementHeight, relativeY);

            const insertionFunction = relativeY < elementHeight / 2 ? 'insertBefore' : 'insertAfter';
            const draggedElementToBeDropped = $('div#app-description').data('draggedElement');

            $(draggedElementToBeDropped)[insertionFunction]($(this));

        }).on('dragenter', appDescriptionImmediateChildrenSelector, function() {
            if (this != $('div#app-description').data('draggedElement')) { // Should not include itself
                $(this).css('outline', '5px solid magenta');
                $('div#app-description').data('hoveredWhileDraggingElement', this);
            }
        }).on('dragleave', appDescriptionImmediateChildrenSelector, function() {
            $(this).css('outline', '');
            $('div#app-description').data('hoveredWhileDraggingElement', undefined);

        }).on('dragstart', appDescriptionImmediateChildrenSelector, function() {
            $('div#app-description').data('draggedElement', this);
            console.log('DRAGSTART', this);

        }).on('drop', appDescriptionImmediateChildrenSelector, function(event) {
            event.preventDefault(); // Prevent the browser default handling of the data (default is open as link on drop)
            const draggedElementToBeDropped = $('div#app-description').data('draggedElement');
            const hoveredElementToReceiveNewSibling = $('div#app-description').data('hoveredWhileDraggingElement');

            console.log('DROPPING ELEMENT...', draggedElementToBeDropped);

            $('div#app-description').data('draggedElement', undefined);
        });

        $('button#fetch-github-user-repos').on('click', function() {
            const githubUsername = $('input#github-user').val();
            const githubUsernamePlaceholder = $('input#github-user').attr('placeholder');
            const finalUsername = githubUsername ? githubUsername : githubUsernamePlaceholder;

            if (!finalUsername) {
                alert('No GitHub username set!');
            } else {
                $('button#inspect-github-user-project').prop('disabled', true);
                const githubReposSelectList = $('#github-user-repos').html('');

                fetchData(`/github-repos?username=${encodeURIComponent(githubUsername ? githubUsername : githubUsernamePlaceholder)}`, 'json').then(json => {
                    console.log(json);
                    json.map(repo => {
                        const serializedRepositoryData = JSON.stringify({full_name: repo.full_name, default_branch: repo.default_branch});
                        return `<option value="${escapeHtmlAttr(serializedRepositoryData)}" data-html-url="${repo.html_url}" data-default-branch="${repo.default_branch}">${repo.name}</option>`;
                    }).forEach(option => githubReposSelectList.append(option));

                    $('button#inspect-github-user-project').prop('disabled', false);
                });
            }
        });

        $('button#inspect-github-user-project').on('click', function() {
            const repositoryData = JSON.parse($('select#github-user-repos').val() || '{}');

            if (repositoryData) {
                fetchData(`/github-repo-inspect?repositoryFullName=${repositoryData.full_name}&defaultBranchName=${encodeURIComponent(repositoryData.default_branch)}`);
            }
        });
}

function wrapElementWithTag(elementType) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Avoid modifying empty selections
  if (range.collapsed) return;

  const strong = document.createElement(elementType);
  strong.appendChild(range.extractContents());
  range.insertNode(strong);

  // Move cursor after the bold text
  range.setStartAfter(strong);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function setStoredSelectedElement(element) {
    $('div#app-description').data('selectedElement', element);
}

function getStoredSelectedElement() {
    return $('div#app-description').data('selectedElement');
}

function editElement(element) {
    if (element && $(element).attr('contenteditable') === 'true') {
        $(element).addClass('is-editing');
    }
}

function uneditElement(element) {
    if (element && $(element).attr('contenteditable') === 'true') {
        $(element).removeClass('is-editing');
    }
}

function showElement(element) {
    element.removeClass('not-displayed');
}
function hideElement(element) {
    element.addClass('not-displayed');
}

$(document).ready(function() {
    $('button#generate-markdown').on('click', function() {
        const markdownHtml = generateMarkdown();
        const generatedMarkdown = marked.parse(markdownHtml);
        debugger;
        $('div#generated-markdown').html(generatedMarkdown);
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => console.log('Mutation detected:', mutation));
    });

    addDragEvents();
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
                setStoredSelectedElement(selection.anchorNode);
            }

            //console.log(selection);
            //console.log(selectionRange);

        const anchorNodeParentElement = selection.anchorNode.parentElement;

        if (anchorNodeParentElement.tagName.toLowerCase() === 'a') {
            // Editing a anchor element
            $('input#link-title').val($(anchorNodeParentElement).attr('title'));
            $('input#link-url').val($(anchorNodeParentElement).attr('href'));
            setStoredSelectedElement(anchorNodeParentElement);
            showElement($('#anchor-element-edit-panel'));

        } else if (isWithinContentEditableArea) {
            $('input#link-title, input#link-url').val('');
            setStoredSelectedElement(null);
            hideElement($('#anchor-element-edit-panel'));
        }
    }).on('focus', 'input#link-title, input#link-url', function() {
        const selectedElement = getStoredSelectedElement();
        editElement(selectedElement);

    }).on('blur', 'input#link-title, input#link-url', function() {
        const selectedElement = getStoredSelectedElement();
        uneditElement(selectedElement);

    }).on('click', 'button.action-format-bold', function() {
        wrapElementWithTag('strong');

    }).on('click', 'button.action-format-italic', function() {
        wrapElementWithTag('i');

    }).on('click', 'button.action-format-underlined', function() {
        wrapElementWithTag('u');

    }).on('click', 'button.action-horizontal-rule', function() {
        const storedSelectedAnchorNode = getStoredSelectedElement();
        console.log(storedSelectedAnchorNode);
        const horizontalRule = $(document.createElement('hr')).addClass('has-floating-toolbar')
            .attr({'draggable': 'true', 'data-floating-toolbar-name': 'first-floating-toolbar'});
        $('div#app-description').append(horizontalRule);

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

        toolbar.removeClass('not-visible').css({'right': Math.round(pageOffset.left - elementWidth), 'top': pageOffset.top})
            .siblings('.floating-toolbar').addClass('not-visible').css({'left': '', 'right': '', 'top': ''});

    }).on('mouseout', '.has-floating-toolbar', function() {
        const toolbarName = $(this).attr('data-floating-toolbar-name');
        const toolbar = $(`.floating-toolbar#${toolbarName}`);

        toolbar.addClass('not-visible').css({'left': '', 'right': '', 'top': ''});
    });

    $('input#link-url, input#link-title').on('input', function() {
        const selectedElement = getStoredSelectedElement();

        if (selectedElement) {
            $(selectedElement).removeClass('update-animation');
            void selectedElement.offsetWidth; // force reflow
            $(selectedElement).addClass('update-animation').attr({title: $('input#link-title').val(), href: $('input#link-url').val()});
        }
    });
});