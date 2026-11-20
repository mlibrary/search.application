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

const resetSearchInputValue = ({ searchField, searchInput = getSearchInput } = {}) => {
  searchInput({ searchField }).value = '';
};

const updateSearchInput = ({
  index,
  resetSearchInput = resetSearchInputValue,
  searchField,
  updateLabel = updateSearchInputLabel
} = {}) => {
  // Update the `aria-label` attribute for the search input element to reflect the new index
  updateLabel({ index, searchField });
  // Clear the value of the search input
  resetSearchInput({ searchField });
};

export {
  getSearchInput,
  resetSearchInputValue,
  updateSearchInputLabel,
  updateSearchInput
};
