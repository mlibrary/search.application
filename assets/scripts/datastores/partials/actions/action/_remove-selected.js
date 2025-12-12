import { getTemporaryList, setTemporaryList } from '../../../list/partials/_add-to.js';
import { filterSelectedRecords } from '../../../list/partials/list-item/_checkbox.js';

const deleteSelectedRecords = ({ list, setList = setTemporaryList }) => {
  // Remove all selected records from the temporary list
  filterSelectedRecords().forEach((record) => {
    const [datastore, recordId] = record.split(',');
    delete list[datastore][recordId];
  });

  // Update temporary list
  setList(list);
};

const removeSelected = ({ deleteRecords = deleteSelectedRecords, list = getTemporaryList(), reloadPage = window.location.reload.bind(window.location) } = {}) => {
  // Add event listener
  document.querySelector('.actions button.action__remove-selected').addEventListener('click', () => {
    // Delete selected items from temporary list
    deleteRecords({ list });

    // Reload page to reflect changes
    reloadPage();
  });
};

export { deleteSelectedRecords, removeSelected };
