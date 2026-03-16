import { filterSelectedRecords, splitCheckboxValue } from '../../../../results/partials/results-list/list-item/header/_checkbox.js';
import { getToggleSelectedTab, toggleSelectedButton, updatedList, updateListForTogglingRecords, updateToggleSelectedAction } from '../_toggle-selected.js';
import { setSessionStorage, viewingTemporaryList } from '../../../../list/layout.js';
import { temporaryListBanner } from '../../../../list/partials/_go-to.js';
import { toggleAddedClass } from './_add.js';

const getRemoveSelectedButton = () => {
  return document.querySelector(`#actions__toggle-selected--tabpanel .action__toggle-selected--remove`);
};

const deleteSelectedRecords = ({
  checkboxValues = filterSelectedRecords(),
  list = updatedList,
  removeClass = toggleAddedClass,
  splitValue = splitCheckboxValue
}) => {
  // Create a deep copy of the list to prevent mutating the original list
  const copiedList = JSON.parse(JSON.stringify(list));

  // Loop through the selected record values
  checkboxValues.forEach((value) => {
    // Get the record's datastore and ID
    const { recordDatastore, recordId } = splitValue({ value });

    // Delete the record from the datastore in the final list
    delete copiedList[recordDatastore][recordId];

    // Remove the class to visually indicate the record is no longer in the temporary list
    removeClass({ isAdded: false, recordDatastore, recordId });
  });

  // Return the updated list
  return copiedList;
};

const handleRemoveSelectedClick = ({
  deleteRecords = deleteSelectedRecords,
  event,
  list = updatedList,
  reloadPage = window.location.reload.bind(window.location),
  setList = setSessionStorage,
  showBanner = temporaryListBanner,
  toggleRemoveButton = toggleSelectedButton,
  toggleSelectedTab = getToggleSelectedTab(),
  updateList = updateListForTogglingRecords,
  updateToggleSelected = updateToggleSelectedAction,
  viewingList = viewingTemporaryList()
} = {}) => {
  // Get the button that was clicked and its original text
  const button = event.target;
  const originalText = button.textContent;
  const toggleRemoveButtonArgs = { button, disabled: true, originalText, text: 'Removing...' };

  // Create a shallow copy of the list
  let copiedList = { ...list };

  // Disable the button and change the text to indicate that the removal is in progress
  toggleRemoveButton(toggleRemoveButtonArgs);

  // Update the list by deleting the selected records
  copiedList = deleteRecords({ list: copiedList });

  // Set the updated list
  setList({ itemName: 'temporaryList', value: copiedList });

  // Check if the user is currently viewing My Temporary List
  if (viewingList) {
    // Reload the page to reflect the changes, skipping the need for UI updates
    reloadPage();
  } else {
    // Update the list for removing records
    updateList({ list: copiedList });

    // Enable the button and change the text back to the original text after the removal is complete
    toggleRemoveButton({ ...toggleRemoveButtonArgs, disabled: false });

    // Update the toggle selected action
    updateToggleSelected({ list: copiedList });

    // Update the banner to reflect the new count of items in the list
    showBanner({ list: copiedList });

    // Click the tab to close the tab panel after adding records
    toggleSelectedTab.click();
  }
};

const removeSelectedAction = ({
  button = getRemoveSelectedButton(),
  handleRemoveSelected = handleRemoveSelectedClick
} = {}) => {
  // Add click event listener to the remove selected button
  button.addEventListener('click', (event) => {
    // Handle the remove selected action
    handleRemoveSelected({ event });
  });
};

const removeSelected = ({
  removeAction = removeSelectedAction
} = {}) => {
  // Initialize the remove selected action
  removeAction();
};

export {
  deleteSelectedRecords,
  getRemoveSelectedButton,
  handleRemoveSelectedClick,
  removeSelected,
  removeSelectedAction
};
