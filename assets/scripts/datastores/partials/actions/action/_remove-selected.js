import { setTemporaryList, viewingTemporaryList } from '../../../list/layout.js';
import { filterSelectedRecords } from '../../../list/partials/list-item/_checkbox.js';

const removeSelectedClass = 'actions__remove-selected';

const getRemoveSelectedButton = () => {
  return document.querySelector(`#${removeSelectedClass}--tabpanel .action__remove-selected`);
};

const deleteSelectedRecords = ({ list, setList = setTemporaryList }) => {
  // Remove all selected records from the temporary list
  filterSelectedRecords().forEach((record) => {
    const [datastore, recordId] = record.split(',');
    delete list[datastore][recordId];
  });

  // Update temporary list
  setList(list);
};

const removeSelectedAction = ({ button = getRemoveSelectedButton(), deleteRecords = deleteSelectedRecords, list, reloadPage = window.location.reload.bind(window.location), viewingList = viewingTemporaryList() } = {}) => {
  // Add event listener
  button.addEventListener('click', () => {
    // Delete selected items from temporary list
    deleteRecords({ list });

    // Reload page to reflect changes if currently viewing My Temporary List
    if (viewingList) {
      reloadPage();
    }
  });
};

const removeSelected = ({ list, removeAction = removeSelectedAction } = {}) => {
  // Initialize the add selected action
  removeAction({ list });
};

export {
  deleteSelectedRecords,
  getRemoveSelectedButton,
  removeSelected,
  removeSelectedAction
};
