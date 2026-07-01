const getSearchInput = ({ searchField }) => {
  return searchField.querySelector('.advanced-search__search-field--term-input');
};

const emptySearchInput = ({ searchField, searchInput = getSearchInput } = {}) => {
  searchInput({ searchField }).value = '';
};

export {
  emptySearchInput,
  getSearchInput
};
