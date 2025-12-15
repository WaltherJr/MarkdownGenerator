
export function getElementI18NAttributeNames(element) {
    return $(element).attr('data-i18n-attribute').split(/,\s*/);
}

export function updateElementI18NText(element) {
    getElementI18NAttributeNames(element).forEach(i18nElementAttributeName => {
        const jQueryFunctionRegex = /^\$\.([a-zA-Z]+)$/;
        const jQueryFunctionRegexMatch = i18nElementAttributeName.match(jQueryFunctionRegex);
        const htmlAttributeMatch = i18nElementAttributeName.match(/^[a-z]+(-?[a-z]+)$/);
        const selectorForElement = createSelectorForElement(element);
        const translatedI18NString = getElementI18NString(selectorForElement, i18nElementAttributeName);

        if (jQueryFunctionRegexMatch) {
            const jQueryFunctionToCall = jQueryFunctionRegexMatch[1];
            $(element)[jQueryFunctionToCall](translatedI18NString);
        } else if (htmlAttributeMatch) {
            $(element).attr(htmlAttributeMatch[0], translatedI18NString);
        }
    });
}

export function getElementI18NString(element, i18nElementAttributeName) {
        const jQueryFunctionRegex = /^\$\.([a-zA-Z]+)$/;
        const jQueryFunctionRegexMatch = i18nElementAttributeName.match(jQueryFunctionRegex);
        const htmlAttributeMatch = i18nElementAttributeName.match(/^[a-z]+(-?[a-z]+)$/);

        if (jQueryFunctionRegexMatch) {
            const jQueryFunctionToCall = jQueryFunctionRegexMatch[1];
            return $(element)[jQueryFunctionToCall]();
        } else if (htmlAttributeMatch) {
            const attributeName = htmlAttributeMatch[0];
            console.log(attributeName + "[" + $(element).attr(attributeName) + "]");
            return $(element).attr(attributeName);
        }
}
