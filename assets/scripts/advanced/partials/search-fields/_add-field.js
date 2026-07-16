import { cloneSearchField, getAllSearchFields, getLastSearchField, getSearchFieldIndex } from '../_search-fields.js';
import { resetSearchInput, updateSearchInputLabel } from './_search.js';
import { resetSearchOptionsDropdown, updateSearchOptionsDropdownLabel } from '../../../partials/header/search/_search-options.js';
import { getRemoveSearchFieldButton } from './_remove-field.js';
import { updateBooleanGroup } from './_booleans.js';

/*
  - [x] Get add search field button
*/

const getAddSearchFieldButton = () => {
  return document.querySelector('button.advanced-search__add-field');
};

/*
  - [x] Copy latest field
  - [x] Append the copied field to the DOM
  - [x] Update all id and data-field-id values
    - [x] Update all labels and aria-labels if necessary
  - [] Check the first boolean
  - [] Set select option to default
  - [] Remove any possible value in input
  - [] Run `removeFields` after click
  - [] Remove `style` attribute, if exists
  - [] Reset index on remove
*/

const cloneAndUpdateSearchField = ({
  clonedSearchField = cloneSearchField,
  lastSearchField = getLastSearchField(),
  searchFieldIndex = getSearchFieldIndex,
  updateBooleans = updateBooleanGroup
} = {}) => {
  // Create the cloned search field
  const clonedField = clonedSearchField({ searchField: lastSearchField });

  // Get the index of the last search field, and add 1 to get the new index for the cloned search field
  const newIndex = searchFieldIndex({ searchField: lastSearchField }) + 1;

  // Update the boolean group to prevent overriding the values for the previous search field
  updateBooleans({ index: newIndex, searchField: clonedField });

  // Add Remove Field event listener to the cloned search field

  return clonedField;
};

const appendClonedSearchField = ({
  clonedSearchField = cloneAndUpdateSearchField(),
  lastSearchField = getLastSearchField()
} = {}) => {
  // Append the cloned search field to be the last search field
  lastSearchField.insertAdjacentElement('afterend', clonedSearchField);
};

const updateSearchFieldAttributes = ({ index, removeSearchFieldButton = getRemoveSearchFieldButton, searchField } = {}) => {
  // Set the search field ID
  const searchFieldId = `search-field-${index}`;
  // Update the `id`
  searchField.id = searchFieldId;
  // Update the `data-field-id` for the remove button
  removeSearchFieldButton({ searchField }).setAttribute('data-field-id', searchFieldId);
};

const updateSearchFields = ({
  allSearchFields = getAllSearchFields(),
  updateBooleans = updateBooleanGroup,
  updateDropdownLabel = updateSearchOptionsDropdownLabel,
  updateFieldAttributes = updateSearchFieldAttributes,
  updateInputLabel = updateSearchInputLabel
} = {}) => {
  // Loop through all fields
  allSearchFields.forEach((searchField, index) => {
    // Save the arguments for the functions
    const args = { index, searchField };
    // Update booolean group
    updateBooleans(args);
    // Update dropdown label
    updateDropdownLabel(args);
    // Update input label
    updateInputLabel(args);
    // Update the attributes for the search field
    updateFieldAttributes(args);
  });
};

/*
WHAT

const updateSearchFields = ({
  allSearchFields = getAllSearchFields(),
  updateBooleans = updateBooleanGroup,
  updateDropdownLabel = updateSearchOptionsDropdownLabel,
  updateFieldAttributes = updateSearchFieldAttributes,
  updateInputLabel = updateSearchInputLabel
} = {}) => {
  // Loop through all fields
  allSearchFields.forEach((searchField, index) => {
    // Save the arguments for the functions
    const args = { index, searchField };
    // Update the attributes for the search field
    updateFieldAttributes(args);
    // Update booolean group
    updateBooleans(args);
    // Update dropdown label
    updateDropdownLabel(args);
    // Update input label
    updateInputLabel(args);
  });
};

const resetSearchFieldValues = ({
  lastSearchField = getLastSearchField(),
  resetInput = resetSearchInput,
  resetSearchOptions = resetSearchOptionsDropdown,
  updateBoolean = updateBooleanGroup
} = {}) => {
  // Reset the selected boolean to default
  updateBoolean({ searchField: lastSearchField });

  // Reset the select option to default
  resetSearchOptions({ searchField: lastSearchField });

  // Reset the search input value
  resetInput({ searchField: lastSearchField });
};

const handleAddSearchField = ({
  appendClonedField = appendClonedSearchField,
  resetValues = resetSearchFieldValues,
  searchField,
  updateFields = updateSearchFields
} = {}) => {
  // Create and apply the new search field
  appendClonedField({ searchField });

  // Update the attributes for all search fields
  updateFields();

  // Reset the values for the new search field
  resetValues();
};
*/

const handleAddSearchField = ({
  appendClonedField = appendClonedSearchField,
  updateFields = updateSearchFields
} = {}) => {
  // Create and apply the new search field
  appendClonedField();

  // Update the attributes for all search fields
  updateFields();
};

const addSearchFieldTest = ({
  addSearchFieldButton = getAddSearchFieldButton(),
  handleAddSearch = handleAddSearchField
} = {}) => {
  // Add event listener to the add search field button
  addSearchFieldButton.addEventListener('click', () => {
    // Handle adding the search field
    handleAddSearch();
  });
};

export {
  addSearchFieldTest,
  getAddSearchFieldButton
};
