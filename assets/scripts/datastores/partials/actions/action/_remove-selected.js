import { filterSelectedRecords, splitCheckboxValue } from '../../../list/partials/list-item/_checkbox.js';
import { inTemporaryList, setTemporaryList, viewingTemporaryList } from '../../../list/layout.js';
import { toggleAddedClass } from './_add-selected.js';
import { toggleBanner } from '../../../list/partials/_go-to.js';
import { toggleTabDisplay } from '../../_actions.js';

const removeSelectedClass = 'actions__remove-selected';

const getRemoveSelectedButton = () => {
  return document.querySelector(`#${removeSelectedClass}--tabpanel .action__remove-selected`);
};

const toggleRemoveSelectedButton = ({ button, disabled = false, text }) => {
  button.textContent = disabled ? 'Removing...' : text;
  button.disabled = disabled;
};

const deleteSelectedRecords = ({
  checkboxValues = filterSelectedRecords(),
  list,
  removeClass = toggleAddedClass,
  splitValue = splitCheckboxValue
}) => {
  // Create a deep copy of the list to prevent mutating the original list
  const updatedList = JSON.parse(JSON.stringify(list));

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

const displayRemoveSelectedAction = ({
  checkedValues = filterSelectedRecords(),
  inList = inTemporaryList,
  list,
  splitValue = splitCheckboxValue,
  toggleTab = toggleTabDisplay
} = {}) => {
  // Check if all of the selected records are in the temporary list
  const showTab = checkedValues.every((value) => {
    const { recordDatastore, recordId } = splitValue({ value });
    return inList({ list, recordDatastore, recordId });
  });

  // Show `Remove selected` if all of the selected records are in the temporary list
  toggleTab({ id: removeSelectedClass, show: showTab });
};

const handleRemoveSelectedClick = ({
  deleteRecords = deleteSelectedRecords,
  displayRemoveAction = displayRemoveSelectedAction,
  event,
  list,
  reloadPage = window.location.reload.bind(window.location),
  setList = setTemporaryList,
  showBanner = toggleBanner,
  toggleRemoveButton = toggleRemoveSelectedButton,
  viewingList = viewingTemporaryList()
}) => {
  // Get the button that was clicked and its original text
  const button = event.target;
  const text = button.textContent;

  // Disable the button and change the text to indicate that the removal is in progress
  toggleRemoveButton({ button, disabled: true });

  // Update the list by deleting the selected records
  const updatedList = deleteRecords({ list });

  // Set the updated list
  setList(updatedList);

  // Update the banner to reflect the new count of items in the list
  showBanner({ list: updatedList });

  // Toggle the display of the `Remove selected` action based on the updated list
  displayRemoveAction({ list: updatedList });

  // Enable the button and change the text back to the original text after the removal is complete
  toggleRemoveButton({ button, disabled: false, text });

  // Check if the user is currently viewing My Temporary List
  if (viewingList) {
    // Reload the page to reflect the changes
    reloadPage();
  }
};

const removeSelectedAction = ({
  button = getRemoveSelectedButton(),
  handleRemoveSelected = handleRemoveSelectedClick,
  list
}) => {
  // Add click event listener to the remove selected button
  button.addEventListener('click', (event) => {
    // Handle the remove selected action
    handleRemoveSelected({ event, list });
  });
};

const removeSelected = ({ displayRemoveAction = displayRemoveSelectedAction, list, removeAction = removeSelectedAction } = {}) => {
  // Toggle `Remove selected` action display on load
  displayRemoveAction({ list });

  // Initialize the remove selected action
  removeAction({ list });
};

export {
  deleteSelectedRecords,
  displayRemoveSelectedAction,
  getRemoveSelectedButton,
  handleRemoveSelectedClick,
  removeSelected,
  removeSelectedAction,
  toggleRemoveSelectedButton
};
