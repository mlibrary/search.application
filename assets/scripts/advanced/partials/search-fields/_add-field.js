import { cloneSearchField, getLastSearchField, getSearchFieldIndex, updateSearchField } from '../_search-fields.js';
import { updateBooleanGroup } from './_booleans.js';
import { updateRemoveSearchFieldButton } from './_remove-field.js';
import { updateSearchInput } from './_search.js';
import { updateSearchOptionsDropdown } from '../../../partials/header/search/_search-options.js';

const getAddSearchFieldButton = () => {
  return document.querySelector('button.advanced-search__add-field');
};

const cloneAndUpdateSearchField = ({
  clonedSearchField = cloneSearchField,
  lastSearchField = getLastSearchField(),
  searchFieldIndex = getSearchFieldIndex,
  updateBooleans = updateBooleanGroup,
  updateDropdown = updateSearchOptionsDropdown,
  updateFieldAttributes = updateSearchField,
  updateRemoveButton = updateRemoveSearchFieldButton,
  updateSearch = updateSearchInput
} = {}) => {
  // Create the cloned search field
  const clonedField = clonedSearchField({ searchField: lastSearchField });

  // Get the index of the last search field, and add 1 to get the new index for the cloned search field
  const newIndex = searchFieldIndex({ searchField: lastSearchField }) + 1;

  // Save the arguments for the update functions
  const args = { index: newIndex, searchField: clonedField };

  // Update the search field attributes to reflect the new index
  updateFieldAttributes(args);

  // Update the boolean group to reflect the new index and reset the selected boolean to default
  updateBooleans(args);

  // Update the search options dropdown to reflect the new index and reset it to its default state
  updateDropdown(args);

  // Update the search input to prevent overriding the value for the previous search field
  updateSearch(args);

  // Update the Remove Field button to prevent overriding the value for the previous search field
  updateRemoveButton(args);

  return clonedField;
};

const appendClonedSearchField = ({
  clonedSearchField = cloneAndUpdateSearchField(),
  lastSearchField = getLastSearchField()
} = {}) => {
  // Append the cloned search field to be the last search field
  lastSearchField.insertAdjacentElement('afterend', clonedSearchField);
};

const addSearchField = ({
  addSearchFieldButton = getAddSearchFieldButton(),
  appendClonedField = appendClonedSearchField
} = {}) => {
  // Add event listener to the add search field button
  addSearchFieldButton.addEventListener('click', () => {
    // Create and apply the new search field
    appendClonedField();
  });
};

export {
  addSearchField,
  appendClonedSearchField,
  cloneAndUpdateSearchField,
  getAddSearchFieldButton
};
