const getBooleanGroup = ({ searchField } = {}) => {
  return searchField.querySelector('.advanced-search__search-field--booleans');
};

const updateBooleanGroup = ({ booleanGroup = getBooleanGroup, searchField } = {}) => {
  const booleanInputs = booleanGroup({ searchField }).querySelectorAll('input[type="radio"]');
  booleanInputs.forEach((booleanInput, index) => {
    booleanInput.checked = index === 0;
  });
};

export {
  getBooleanGroup,
  updateBooleanGroup
};
