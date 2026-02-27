const getListItemTitleElement = ({ listItem }) => {
  return listItem.querySelector('.results__list-item--title');
};

const updateListItemTitleNumber = ({ element, index }) => {
  // Get the number element
  const number = element.querySelector('.results__list-item--title-number');

  // Update the text to be one higher than the index
  number.textContent = `${index + 1}.`;
};

const updateListItemTitleAnchor = ({ element, title, url }) => {
  // Get the anchor element
  const anchor = element.querySelector('a.results__list-item--title-original');

  // Update the URL
  anchor.href = url;
  // Update the anchor text
  anchor.textContent = title;
};

const updateListItemTitleTransliterated = ({ element, title }) => {
  // Get the tertiary element
  const transliteratedTitle = element.querySelector('.results__list-item--title-transliterated');

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
  const { original, transliterated } = title;

  // Update the anchor element
  updateTitleFunctions.updateListItemTitleAnchor({ element, title: original, url });

  // Update the transliterated element
  updateTitleFunctions.updateListItemTitleTransliterated({ element, title: transliterated });
};

export {
  getListItemTitleElement,
  updateListItemTitle,
  updateListItemTitleNumber,
  updateListItemTitleAnchor,
  updateListItemTitleTransliterated
};
