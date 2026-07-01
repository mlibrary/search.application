import { getAllSearchFields, getLastSearchField } from '../_search-fields.js';
import { emptySearchInput } from './_search.js';
import { getRemoveSearchFieldButton } from './_remove-field.js';
import { updateBooleanGroup } from './_booleans.js';
import { updateSearchOptionsDropdown } from '../../../partials/header/search/_search-options.js';

/*
  - [x] Get add search field button
  - [x] Copy latest field
  - [x] Append the copied field to the DOM

  - [x] Update all id and data-field-id values
  - [] Check the first boolean
  - [] Set select option to default
  - [] Remove any possible value in input
  - [] Update labels and aria-labels if necessary
  - [] Run `removeFields` after click
*/

const getAddSearchFieldButton = () => {
  return document.querySelector('button.advanced-search__add-field');
};

const cloneLastSearchField = ({ searchField }) => {
  return searchField.cloneNode(true);
};

const appendClonedSearchField = ({
  clonedSearchField = cloneLastSearchField,
  lastSearchField = getLastSearchField(),
  searchField
} = {}) => {
  lastSearchField.insertAdjacentElement('afterend', clonedSearchField({ searchField }));
};

const updateSearchFieldAttributes = ({ allSearchFields = getAllSearchFields(), removeSearchFieldButton = getRemoveSearchFieldButton } = {}) => {
  // Loop through all fields
  allSearchFields.forEach((searchField, index) => {
    // Set the search field ID
    const searchFieldId = `search-field-${index}`;
    // Update the `id`
    searchField.id = searchFieldId;
    // Update the `data-field-id` for the remove button
    removeSearchFieldButton({ searchField }).setAttribute('data-field-id', searchFieldId);
  });
};

const resetSearchFieldValues = ({
  emptyInput = emptySearchInput,
  lastSearchField = getLastSearchField(),
  updateBoolean = updateBooleanGroup,
  updateSearchOptions = updateSearchOptionsDropdown
}) => {
  // Check the first boolean input and uncheck the others
  updateBoolean({ searchField: lastSearchField });

  // Update the select option to default
  updateSearchOptions({ searchField: lastSearchField });

  // Empty the search input value
  emptyInput({ searchField: lastSearchField });
};

const handleAddSearchField = ({
  appendClonedField = appendClonedSearchField,
  resetValues = resetSearchFieldValues,
  searchField,
  updateAttributes = updateSearchFieldAttributes
}) => {
  // Create and apply the new search field
  appendClonedField({ searchField });

  // Update the attributes for all search fields
  updateAttributes();

  // Reset the values for the new search field
  resetValues();
};

const addSearchField = ({
  addSearchFieldButton = getAddSearchFieldButton(),
  handleAddSearch = handleAddSearchField,
  lastSearchField = getLastSearchField()
} = {}) => {
  // Save the search field to be added in the event listener closure
  const searchField = lastSearchField;
  // Add event listener to the add search field button
  addSearchFieldButton.addEventListener('click', () => {
    // Handle adding the search field
    handleAddSearch({ searchField });
  });
};

export {
  addSearchField,
  appendClonedSearchField,
  cloneLastSearchField,
  getAddSearchFieldButton,
  handleAddSearchField,
  resetSearchFieldValues,
  updateSearchFieldAttributes
};
