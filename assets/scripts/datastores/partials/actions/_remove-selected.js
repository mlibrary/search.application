import { getTemporaryList, setTemporaryList } from '../../list/partials/_add-to.js';
import { getCheckboxes } from '../../list/layout.js';

const removeSelectedButton = () => {
  return document.querySelector('.actions button.action__remove-selected');
};

const removeSelected = (reloadPage = window.location.reload.bind(window.location)) => {
  // Add event listener
  removeSelectedButton().addEventListener('click', () => {
    // Get checkbox values
    const records = [...getCheckboxes()]
      .filter((checkbox) => {
        return checkbox.checked;
      })
      .map((checkbox) => {
        return checkbox.value;
      });
    // Delete selected items from temporary list
    const list = getTemporaryList();
    records.forEach((record) => {
      const [datastore, recordId] = record.split(',');
      delete list[datastore][recordId];
    });
    // Update temporary list
    setTemporaryList(list);
    // Reload page to reflect changes
    // `reloadPage` is passed in for testing purposes
    reloadPage();
  });
};

export { removeSelected, removeSelectedButton };
