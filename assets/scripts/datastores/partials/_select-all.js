import { getCheckboxes, someCheckboxesChecked } from '../list/partials/list-item/_checkbox.js';

const getSelectAllCheckbox = () => {
  return document.querySelector('input[type="checkbox"].select-all__checkbox');
};

const selectAllCheckboxState = ({ checkbox, someChecked = someCheckboxesChecked }) => {
  checkbox.indeterminate = someChecked(true) && someChecked(false);
  checkbox.checked = someChecked(true) && !someChecked(false);
};

const selectAll = ({
  checkbox = getSelectAllCheckbox(),
  checkboxes = getCheckboxes(),
  selectCheckboxState = selectAllCheckboxState
} = {}) => {
  // Initialize the state of the checkbox
  selectCheckboxState({ checkbox });

  // Add event listener
  checkbox.addEventListener('change', () => {
    // Check all checkboxes if `Select all` checkbox is checked
    const checked = checkbox.checked === true;
    checkboxes.forEach((recordCheckbox) => {
      recordCheckbox.checked = checked;
    });

    // Update the state of the select all checkbox
    selectCheckboxState({ checkbox });
  });
};

export { getSelectAllCheckbox, selectAll, selectAllCheckboxState };
