import { getCheckboxes, someCheckboxesChecked } from '../list/partials/list-item/_checkbox.js';

const getSelectAllCheckbox = () => {
  return document.querySelector('input[type="checkbox"].select-all__checkbox');
};

const selectAllCheckboxState = ({ checkbox = getSelectAllCheckbox(), someChecked = someCheckboxesChecked }) => {
  checkbox.indeterminate = someChecked(true) && someChecked(false);
  checkbox.checked = someChecked(true) && !someChecked(false);
};

const selectAll = ({
  checkbox = getSelectAllCheckbox(),
  checkboxes = getCheckboxes(),
  selectCheckboxState = selectAllCheckboxState
} = {}) => {
  // Initialize the state of the checkbox
  selectCheckboxState();

  // Add event listener
  checkbox.addEventListener('change', () => {
    // Check all checkboxes if `Select all` checkbox is indeterminate or unchecked
    const checked = checkbox.indeterminate || !checkbox.checked;
    checkboxes.forEach((recordCheckbox) => {
      recordCheckbox.checked = checked;
    });

    // Update the state of the select all checkbox
    selectCheckboxState();
  });
};

export { getSelectAllCheckbox, selectAll, selectAllCheckboxState };
