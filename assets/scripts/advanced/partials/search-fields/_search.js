const getSearchInput = ({ searchField }) => {
  return searchField.querySelector('.advanced-search__search-field--term-input');
};

const updateSearchInputLabel = ({ index, searchField, searchInput = getSearchInput } = {}) => {
  // Get the input element
  const input = searchInput({ searchField });
  // Get the current `aria-label` attribute value
  const label = input.getAttribute('aria-label');
  // Use regex to replace the index in the `aria-label` attribute value
  input.setAttribute('aria-label', label.replace(/\d+/u, index));
};

const resetSearchInput = ({ searchField, searchInput = getSearchInput } = {}) => {
  searchInput({ searchField }).value = '';
};

export {
  getSearchInput,
  resetSearchInput,
  updateSearchInputLabel
};
