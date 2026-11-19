const getListItemTitleElement = ({ listItem }) => {
  return listItem.querySelector('.results__list-item--title');
};

const updateListItemTitleNumber = ({ element, index }) => {
  // Get the number element
  const number = element.querySelector('.results__list-item--title-number');

  // Update the text to be one higher than the index
  number.textContent = `${index + 1}.`;
};

const updateListItemTitleExternalAnchor = ({ anchor, title, url }) => {
  // Add `utm-source` parameter to the URL
  const urlObj = new URL(url);
  urlObj.searchParams.set('utm-source', 'mlibrary');
  anchor.href = urlObj.toString();
  // Add to class list
  anchor.classList.add('open-in-new');
  // Add `target`
  anchor.target = '_blank';
  // Add `rel` attribute for security
  anchor.rel = 'noopener noreferrer';
  // Indicate that the link opens in a new tab
  anchor.setAttribute('aria-label', `${title} - opens in new window`);
};

const updateListItemTitleAnchor = ({ element, externalAnchor = updateListItemTitleExternalAnchor, hasExternalUrl, title, url }) => {
  // Get the anchor element
  const anchor = element.querySelector('a.results__list-item--title-original');

  // Update the URL
  anchor.href = url;
  // Update the anchor text
  anchor.textContent = title;

  // Check if the title has an external URL
  if (hasExternalUrl) {
    // Update the external anchor attributes
    externalAnchor({ anchor, title, url });
  }
};

const updateListItemTitleTransliterated = ({ element, title }) => {
  // Get the tertiary element
  const transliteratedTitle = element.querySelector('.results__list-item--title-transliterated');

  // Return early if the transliterated title element is not found
  if (!transliteratedTitle) {
    return;
  }

  if (title) {
    // Update the text
    transliteratedTitle.textContent = title;
  } else {
    // Remove the element
    transliteratedTitle.remove();
  }
};

const updateListItemTitleFunctions = {
  updateListItemTitleAnchor,
  updateListItemTitleNumber,
  updateListItemTitleTransliterated
};

const updateListItemTitle = ({
  getTitleElement = getListItemTitleElement,
  hasExternalUrl,
  index,
  listItem,
  title,
  updateTitleFunctions = updateListItemTitleFunctions,
  url
}) => {
  // Get the title element
  const element = getTitleElement({ listItem });

  // Return early if element is not found
  if (!element) {
    return;
  }

  // Update the number
  updateTitleFunctions.updateListItemTitleNumber({ element, index });

  // Get the title properties
  const { original, text, transliterated } = title;

  // Update the anchor element
  updateTitleFunctions.updateListItemTitleAnchor({ element, hasExternalUrl, title: text ?? original.text, url });

  // Update the transliterated element
  updateTitleFunctions.updateListItemTitleTransliterated({ element, title: transliterated?.text });
};

export {
  getListItemTitleElement,
  updateListItemTitle,
  updateListItemTitleAnchor,
  updateListItemTitleExternalAnchor,
  updateListItemTitleNumber,
  updateListItemTitleTransliterated
};
