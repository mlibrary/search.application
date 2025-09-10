import { getCheckboxes, someCheckboxesChecked } from '../layout.js';

const selectAllCheckbox = () => {
  return document.querySelector('.select-all > input[type="checkbox"]');
};

const selectAllState = () => {
  const checkbox = selectAllCheckbox();

  checkbox.indeterminate = someCheckboxesChecked(true) && someCheckboxesChecked(false);
  checkbox.checked = someCheckboxesChecked(true) && !someCheckboxesChecked(false);
};

const selectAll = () => {
  // Initialize the state of the checkbox
  selectAllState();

  // Add event listener
  selectAllCheckbox().addEventListener('change', () => {
    // Check all checkboxes if some are unchecked, otherwise uncheck all
    const checked = someCheckboxesChecked(false);
    getCheckboxes().forEach((checkbox) => {
      checkbox.checked = checked;
    });
    // Update the state of the select all checkbox
    selectAllState();
  });
};

export { selectAll, selectAllCheckbox, selectAllState };
