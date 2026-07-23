import { filterSelectionsCheckboxes } from './_checkboxes.js';

const getSelectionsFilter = ({ selections }) => {
  return selections.querySelector('.additional-option__selections--text');
};

const handleSelectionsFilterChange = ({ filterCheckboxes = filterSelectionsCheckboxes, selections, selectionsFilter = getSelectionsFilter }) => {
  // Get the filter input element
  const filterInput = selectionsFilter({ selections });
  // Listen for input changes
  filterInput.addEventListener('input', (event) => {
    // Apply the filter to the checkboxes
    filterCheckboxes({ filter: event.target.value, selections });
  });
};

const initializeSelectionsFilter = ({ handleFilterChange = handleSelectionsFilterChange, selections }) => {
  // Initialize the filter for the current selection
  handleFilterChange({ selections });
};

export {
  getSelectionsFilter,
  handleSelectionsFilterChange,
  initializeSelectionsFilter
};
