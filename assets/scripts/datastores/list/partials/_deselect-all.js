import { getCheckboxes, someCheckboxesChecked } from '../layout.js';
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
    disableDeselectAllButton();
    disableSelectAllButton();
  });
};

export { deselectAll, deselectAllButton, disableDeselectAllButton };
