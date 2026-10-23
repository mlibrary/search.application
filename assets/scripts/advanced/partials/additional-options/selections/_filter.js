import { filterSelectionsCheckboxes, getSelectionsVisibleCheckedCheckboxes } from './_checkboxes.js';
import { updateShowSelectedButtonCount } from './_show-selected.js';

const getSelectionsFilter = ({ selections }) => {
  return selections.querySelector('.additional-option__selections--text');
};

const getSelectionsFilterValue = ({ selections, selectionsFilter = getSelectionsFilter }) => {
  // Return the value of the filter input element
  return selectionsFilter({ selections }).value;
};

const checkSelectionsCheckboxValueByFilter = ({ checkbox, getFilterValue = getSelectionsFilterValue, selections }) => {
  // Get the value of the filter input element
  const filterValue = getFilterValue({ selections });
  // Return true if filter value is empty or if the checkbox value includes the filter value (case-insensitive)
  if (!filterValue) {
    return true;
  }
  // Get the value of the checkbox
  const checkboxValue = checkbox.getAttribute('data-filter-value');
  // Check if the checkbox value includes the filter value (case-insensitive)
  return checkboxValue.toLowerCase().includes(filterValue.toLowerCase());
};

const handleSelectionsFilterChange = ({
  button,
  filterCheckboxes = filterSelectionsCheckboxes,
  getVisibleCheckedCheckboxes = getSelectionsVisibleCheckedCheckboxes,
  selections,
  selectionsFilter = getSelectionsFilter,
  updateButtonCount = updateShowSelectedButtonCount
}) => {
  // Get the filter input element
  const filterInput = selectionsFilter({ selections });
  // Listen for input changes
  filterInput.addEventListener('input', (event) => {
    // Apply the filter to the checkboxes
    filterCheckboxes({ button, filter: event.target.value, selections });
    // Get the count of visible checked checkboxes
    const count = getVisibleCheckedCheckboxes({ selections }).length;
    // Update the count of visible checked checkboxes
    updateButtonCount({ button, count });
  });
};

const initializeSelectionsFilter = ({ button, handleFilterChange = handleSelectionsFilterChange, selections }) => {
  // Initialize the filter for the current selection
  handleFilterChange({ button, selections });
};

export {
  checkSelectionsCheckboxValueByFilter,
  getSelectionsFilter,
  getSelectionsFilterValue,
  handleSelectionsFilterChange,
  initializeSelectionsFilter
};
