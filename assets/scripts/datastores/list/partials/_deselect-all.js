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
  disableDeselectAllButton();
  deselectAllButton().addEventListener('click', () => {
    getCheckboxes().forEach((checkbox) => {
      checkbox.checked = false;
    });
    disableSelectAllButton();
    disableDeselectAllButton();
    disableRemoveSelectedButton();
  });
};

export { deselectAll, deselectAllButton, disableDeselectAllButton };
