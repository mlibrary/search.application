const getAllSearchFields = () => {
  return document.querySelectorAll('.advanced-search__search-field');
};

const getLastSearchField = () => {
  return getAllSearchFields()[getAllSearchFields().length - 1];
};

const cloneSearchField = ({ searchField }) => {
  return searchField.cloneNode(true);
};

const getSearchFieldIndex = ({ searchField }) => {
  return parseInt(searchField.id.replace('search-field-', ''), 10);
};

export {
  cloneSearchField,
  getAllSearchFields,
  getLastSearchField,
  getSearchFieldIndex
};
