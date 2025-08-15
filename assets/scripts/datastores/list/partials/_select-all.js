import { getCheckboxes, someCheckboxesChecked } from '../layout.js';
import { disableDeselectAllButton } from './_deselect-all.js';

const selectAllButton = () => {
  return document.querySelector('button.list__button--select-all');
};

const disableSelectAllButton = () => {
  selectAllButton().toggleAttribute('disabled', !someCheckboxesChecked());
};

const selectAll = () => {
  disableSelectAllButton();
  selectAllButton().addEventListener('click', () => {
    getCheckboxes().forEach((checkbox) => {
      checkbox.checked = true;
    });
    disableSelectAllButton();
    disableDeselectAllButton();
  });
};

export { disableSelectAllButton, selectAll };
