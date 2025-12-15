
export function escapeHtmlAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function fetchData(url, responseHandler) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error(response);
        }
        const returnValue = response[responseHandler]();
        return returnValue;
    })
    .catch(error => {
        return error;
    });
}

export function wrapElementWithTag(elementType) {
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

export function setStoredSelectedElement(element) {
    $('div#app-description').data('selectedElement', element);
}

export function setEditedElement(panel, element) {
    panel.data('editedElement', element);

    if (element.get(0).tagName.toLowerCase() === 'img') {
        setEditedImageElement(element);
    }
}

// TODO: use 2 images (animate width and height)
setEditedImageElement(imageElement) {
        imageElement.css({width: imageElement.width() + 'px', height: imageElement.height() + 'px', outline: '2px solid red'});
        imageElement.off('load');
        imageElement.get(0).addEventListener('load', function(event) {
            alert('IMAGE LOAD!');
            const a = event.target;
            debugger;
            $(event.target).css({width: event.target.width + 'px', height: event.target.height + 'px', outline: '2px solid red'});
        });
}

export function getEditedElement(panel) {
    return panel.data('editedElement');
}

export function getStoredSelectedElement() {
    return $('div#app-description').data('selectedElement');
}

export function editElement(element) {
    if (element && $(element).attr('contenteditable') === 'true') {
        $(element).addClass('is-editing');
    }
}

export function addElementToAppDescription(element) {
    $('div#app-description').append(element.attr('draggable', 'true'));
}

export function uneditElement(element) {
    if (element && $(element).attr('contenteditable') === 'true') {
        $(element).removeClass('is-editing');
    }
}

export function showElement(element) {
    element.removeClass('not-displayed');
}
export function hideElement(element) {
    element.addClass('not-displayed');
}

export function activatePanel(panel, editedElement) {
    setEditedElement(panel, editedElement); // Needs to be called first (img will not set width and height to original image if updating to non-edisting image src)
    panel.find('[data-bind-attribute]').each(function(index, element) {
        const databindAttribute = $(element).attr('data-bind-attribute');
        const val = editedElement.attr(databindAttribute);
        $(element).val(val);
    });

    showElement(panel);
}

export function createSelectorForElement(element, builtSelectorSoFar) {
    const elementId = $(element).attr('id');

    if (element.get(0).tagName.toLowerCase() === 'html') {
        return 'html' + builtSelectorSoFar;
    } else if (elementId) {
        return `#${elementId}` + builtSelectorSoFar;
    } else {
        // Assume an element ID is more up in the DOM, and use child selectors for this iteration
        return createSelectorForElement(element.parent(), ` > *:nth-child(${element.index() + 1})` + builtSelectorSoFar);
    }
}
