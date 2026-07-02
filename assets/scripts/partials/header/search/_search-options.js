const getSearchOptionsDropdown = ({ searchField }) => {
  return searchField.querySelector('.search-form__inputs--select');
};

const getSearchOptions = ({ searchField, searchOptionsDropdown = getSearchOptionsDropdown } = {}) => {
  return searchOptionsDropdown({ searchField }).querySelectorAll('option');
};

const updateSearchOptionsDropdownLabel = ({ index, searchField, searchOptionsDropdown = getSearchOptionsDropdown } = {}) => {
  // Get the dropdown element
  const dropdown = searchOptionsDropdown({ searchField });
  // Get the current `aria-label` attribute value
  const label = dropdown.getAttribute('aria-label');
  // Use regex to replace the index in the `aria-label` attribute value
  dropdown.setAttribute('aria-label', label.replace(/\d+/u, index));
};

const resetSearchOptionsDropdown = ({ searchField, searchOptions = getSearchOptions } = {}) => {
  // Loop through the search options
  searchOptions({ searchField }).forEach((option, index) => {
    // Set the selected attribute to true for the first option and false for the others
    option.selected = index === 0;
  });
};

export {
  getSearchOptions,
  getSearchOptionsDropdown,
  resetSearchOptionsDropdown,
  updateSearchOptionsDropdownLabel
};
