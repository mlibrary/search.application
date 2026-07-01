const getAllSearchFields = () => {
  return document.querySelectorAll('.advanced-search__search-field');
};

const getLastSearchField = () => {
  return getAllSearchFields()[getAllSearchFields().length - 1];
};

export {
  getAllSearchFields,
  getLastSearchField
};
