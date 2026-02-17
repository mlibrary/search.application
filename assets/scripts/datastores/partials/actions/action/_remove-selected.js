import { filterSelectedRecords } from '../../../list/partials/list-item/_checkbox.js';
import { setSessionStorage } from '../../../list/layout.js';

const deleteSelectedRecords = ({ list, setList = setSessionStorage }) => {
  // Remove all selected records from the temporary list
  filterSelectedRecords().forEach((record) => {
    const [datastore, recordId] = record.split(',');
    delete list[datastore][recordId];
  });

  // Update temporary list
  setList({ itemName: 'temporaryList', value: list });
};

const removeSelected = ({ deleteRecords = deleteSelectedRecords, list, reloadPage = window.location.reload.bind(window.location) } = {}) => {
  // Add event listener
  document.querySelector('.actions button.action__remove-selected').addEventListener('click', () => {
    // Delete selected items from temporary list
    deleteRecords({ list });

    // Reload page to reflect changes
    reloadPage();
  });
};

export { deleteSelectedRecords, removeSelected };
