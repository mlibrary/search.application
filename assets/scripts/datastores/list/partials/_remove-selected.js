import { getCheckboxes, someCheckboxesChecked } from '../layout.js';
import { getTemporaryList, setTemporaryList } from './_add-to.js';

const removeSelectedButton = () => {
  return document.querySelector('button.list__button--remove-selected');
};

const disableRemoveSelectedButton = () => {
  removeSelectedButton().toggleAttribute('disabled', !someCheckboxesChecked(true));
};

const removeSelected = (reloadPage = window.location.reload.bind(window.location)) => {
  // Initialize button state
  disableRemoveSelectedButton();
  // Add event listener
  removeSelectedButton().addEventListener('click', () => {
    // Get checkbox values
    const recordIds = [...getCheckboxes()]
      .filter((checkbox) => {
        return checkbox.checked;
      })
      .map((checkbox) => {
        return checkbox.value;
      });
    // Delete selected items from temporary list
    const list = getTemporaryList();
    recordIds.forEach((recordId) => {
      delete list[recordId];
    });
    // Update temporary list
    setTemporaryList(list);
    // Reload page to reflect changes
    // `reloadPage` is passed in for testing purposes
    reloadPage();
  });
};

export { disableRemoveSelectedButton, removeSelected, removeSelectedButton };
