import { getCheckboxes, someCheckboxesChecked } from '../layout.js';
import { disableDeselectAllButton } from './_deselect-all.js';
import { disableRemoveSelectedButton } from './_remove-selected.js';

const selectAllButton = () => {
  return document.querySelector('button.list__button--select-all');
};

const disableSelectAllButton = () => {
  selectAllButton().toggleAttribute('disabled', !someCheckboxesChecked());
};

const selectAll = () => {
  // Initialize button state
  disableSelectAllButton();
  // Add event listener
  selectAllButton().addEventListener('click', () => {
    // Select all checkboxes
    getCheckboxes().forEach((checkbox) => {
      checkbox.checked = true;
    });
    // Update button states
    disableSelectAllButton();
    disableDeselectAllButton();
    disableRemoveSelectedButton();
  });
};

export { disableSelectAllButton, selectAll, selectAllButton };
