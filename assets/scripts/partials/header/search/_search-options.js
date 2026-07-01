const getSearchOptionsDropdown = ({ searchField }) => {
  return searchField.querySelector('.search-form__inputs--select');
};

const getSearchOptions = ({ searchField, searchOptionsDropdown = getSearchOptionsDropdown } = {}) => {
  return searchOptionsDropdown({ searchField }).querySelectorAll('option');
};

const updateSearchOptionsDropdown = ({ searchField, searchOptions = getSearchOptions } = {}) => {
  // Loop through the search options and set the first option as selected and the others as not selected
  searchOptions({ searchField }).forEach((option, index) => {
    option.selected = index === 0;
  });
};

export {
  getSearchOptions,
  getSearchOptionsDropdown,
  updateSearchOptionsDropdown
};
