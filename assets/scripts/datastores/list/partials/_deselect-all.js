import { getCheckboxes, someCheckboxesChecked } from '../layout.js';
import { disableRemoveSelectedButton } from './_remove-selected.js';
import { disableSelectAllButton } from './_select-all.js';

const deselectAllButton = () => {
  return document.querySelector('button.list__button--deselect-all');
};

const disableDeselectAllButton = () => {
  deselectAllButton().toggleAttribute('disabled', !someCheckboxesChecked(true));
};

const deselectAll = () => {
  // Initialize button state
  disableDeselectAllButton();
  // Add event listener
  deselectAllButton().addEventListener('click', () => {
    // Deselect all checkboxes
    getCheckboxes().forEach((checkbox) => {
      checkbox.checked = false;
    });
    // Update button states
    disableSelectAllButton();
    disableDeselectAllButton();
    disableRemoveSelectedButton();
  });
};

export { deselectAll, deselectAllButton, disableDeselectAllButton };
