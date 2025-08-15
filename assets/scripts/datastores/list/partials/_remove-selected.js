import { getCheckboxes, someCheckboxesChecked } from '../layout.js';
import { getTemporaryList, setTemporaryList } from './_add-to.js';

const removeSelectedButton = () => {
  return document.querySelector('button.list__button--remove-selected');
};

const disableRemoveSelectedButton = () => {
  removeSelectedButton().toggleAttribute('disabled', !someCheckboxesChecked(true));
};

const removeSelected = () => {
  disableRemoveSelectedButton();
  removeSelectedButton().addEventListener('click', () => {
    // Get checkbox values
    const recordIds = [...getCheckboxes()].map((checkbox) => {
      if (checkbox.checked) {
        return checkbox.value;
      }
    });
    const list = getTemporaryList();
    recordIds.forEach((recordId) => {
      delete list[recordId];
    });
    setTemporaryList(list);
    window.location.reload();
  });
};

export { disableRemoveSelectedButton, removeSelected, removeSelectedButton };
