import { addSearchField } from './search-fields/_add-field.js';
import { removeSearchField } from './search-fields/_remove-field.js';

const getAllSearchFields = () => {
  return document.querySelectorAll('.advanced-search__search-field');
};

const getLastSearchField = ({ searchFields = getAllSearchFields() } = {}) => {
  return searchFields[searchFields.length - 1];
};

const cloneSearchField = ({ searchField }) => {
  return searchField.cloneNode(true);
};

const getSearchFieldIndex = ({ searchField }) => {
  return parseInt(searchField.id.replace('search-field-', ''), 10);
};

const updateSearchField = ({ index, searchField } = {}) => {
  // Get the search field ID
  const searchFieldId = searchField.getAttribute('id');
  // Update the `id` for the search field
  searchField.setAttribute('id', searchFieldId.replace(/\d+/u, index));
};

const initializeSearchFields = ({ addField = addSearchField, removeField = removeSearchField } = {}) => {
  // Remove search field
  removeField();

  // Add search field
  addField();
};

export {
  cloneSearchField,
  getAllSearchFields,
  getLastSearchField,
  getSearchFieldIndex,
  initializeSearchFields,
  updateSearchField
};
