import { filterSelectedRecords, splitCheckboxValue } from '../../../list/partials/list-item/_checkbox.js';
import { inTemporaryList, setTemporaryList, viewingTemporaryList } from '../../../list/layout.js';
import { toggleAddedClass } from './_add-selected.js';
import { toggleTabDisplay } from '../../_actions.js';

const removeSelectedClass = 'actions__remove-selected';

const getRemoveSelectedButton = () => {
  return document.querySelector(`#${removeSelectedClass}--tabpanel .action__remove-selected`);
};

const deleteSelectedRecordsTest = ({ checkboxValues = filterSelectedRecords(), list, removeClass = toggleAddedClass, splitValue = splitCheckboxValue }) => {
  // Create a shallow copy of the list to update
  const updatedList = { ...list };

  // Loop through the selected record values
  checkboxValues.forEach((value) => {
    // Get the record's datastore and ID
    const { recordDatastore, recordId } = splitValue({ value });

    // Delete the record from the datastore in the final list
    delete updatedList[recordDatastore][recordId];

    // Remove the class to visually indicate the record is no longer in the temporary list
    removeClass({ isAdded: false, recordDatastore, recordId });
  });

  // Return the updated list
  return updatedList;
};

const displayRemoveSelectedAction = ({ checkedValues = filterSelectedRecords(), inList = inTemporaryList, list, splitValue = splitCheckboxValue, toggleTab = toggleTabDisplay } = {}) => {
  // Check if all of the selected records are in the temporary list
  const showTab = checkedValues.every((value) => {
    const { recordDatastore, recordId } = splitValue({ value });
    return inList({ list, recordDatastore, recordId });
  });

  // Show `Remove selected` if all of the selected records are in the temporary list
  toggleTab({ id: removeSelectedClass, show: showTab });
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

const removeSelected = ({ list, removeAction = removeSelectedAction, toggleAction = displayRemoveSelectedAction } = {}) => {
  // Toggle `Add selected` action based on current selection
  toggleAction({ list });

  // Initialize the add selected action
  removeAction({ list });
};

export {
  deleteSelectedRecords,
  deleteSelectedRecordsTest,
  displayRemoveSelectedAction,
  getRemoveSelectedButton,
  removeSelected,
  removeSelectedAction
};
