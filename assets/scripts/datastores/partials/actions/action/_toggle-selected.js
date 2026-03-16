import { filterSelectedRecords, splitCheckboxValue } from '../../../results/partials/results-list/list-item/header/_checkbox.js';
import { inTemporaryList, viewingTemporaryList } from '../../../list/layout.js';
import { addSelected } from './toggle-selected/_add.js';
import { removeSelected } from './toggle-selected/_remove.js';
import { viewingFullRecord } from '../../../record/layout.js';

let updatedList = null;

const updateListForTogglingRecords = ({ list }) => {
  updatedList = list;
};

const toggleSelectedId = 'actions__toggle-selected';

const getToggleSelectedTab = () => {
  return document.getElementById(toggleSelectedId);
};

const getToggleSelectedTabPanel = () => {
  return document.getElementById(`${toggleSelectedId}--tabpanel`);
};

const checkIfInList = ({
  checkedValues = filterSelectedRecords(),
  inList = inTemporaryList,
  list,
  splitValue = splitCheckboxValue,
  viewingList = viewingTemporaryList()
}) => {
  // Check if currently viewing My Temporary List
  if (viewingList) {
    // Return `true` because all records in My Temporary List are, by definition, in My Temporary List
    return true;
  }

  // Check if there are any checked records
  if (!checkedValues.length) {
    // Return `false` because there are no checked records to be in My Temporary List
    return false;
  }

  // Return whether all checked records are in My Temporary List
  return checkedValues.every((value) => {
    const { recordDatastore, recordId } = splitValue({ value });
    return inList({ list, recordDatastore, recordId });
  });
};

const updateToggleSelectedTabText = ({
  fullRecord = viewingFullRecord(),
  inList,
  tab = getToggleSelectedTab()
}) => {
  // Create an array of words to form the tab text:
  // - Starting with `Add` if not in the list, or `Remove` if in the list
  // - Ending with `selected` if not viewing a full record, or `record` if viewing a full record
  const tabTextArray = [
    inList ? 'Remove' : 'Add',
    fullRecord ? 'record' : 'selected'
  ];

  // Join the array with a non-breaking space and update the tab's HTML
  tab.innerHTML = tabTextArray.join('&nbsp;');
};

const toggleActionClasses = ({
  inList,
  tab = getToggleSelectedTab(),
  tabPanel = getToggleSelectedTabPanel()
}) => {
  // Toggle the tab class to indicate whether the action will remove the selected record(s) or not
  tab.classList.toggle('actions__toggle-selected--remove', inList);
  // Toggle the tab panel class to indicate whether the action will remove the selected record(s) or not
  tabPanel.classList.toggle('actions__toggle-selected--tabpanel-remove', inList);
};

const updateToggleSelectedAction = ({
  checkIfAllInList = checkIfInList,
  list = updatedList,
  toggleClasses = toggleActionClasses,
  updateText = updateToggleSelectedTabText
} = {}) => {
  // Check if all checked records are in My Temporary List
  const inList = checkIfAllInList({ list });

  // Update the tab text
  updateText({ inList });

  // Update the tab and tab panel classes
  toggleClasses({ inList });
};

const toggleSelectedButton = ({ button, disabled = false, originalText, text }) => {
  // Update the button text depending on whether the button is being disabled or enabled
  button.textContent = disabled ? text : originalText;
  // Update the button disabled state
  button.disabled = disabled;
};

const toggleSelectedAction = ({
  add = addSelected,
  list,
  remove = removeSelected,
  updateAction = updateToggleSelectedAction,
  updateList = updateListForTogglingRecords
} = {}) => {
  // Update the list that will be passed to the add and remove functions
  updateList({ list });

  // Initialize adding selected record(s) to My Temporary List
  add();

  // Initialize removing selected record(s) from My Temporary List
  remove();

  // Update the toggle selected action (text and classes) based on whether the selected record(s) are in My Temporary List
  updateAction();
};

export {
  checkIfInList,
  getToggleSelectedTab,
  getToggleSelectedTabPanel,
  toggleActionClasses,
  toggleSelectedAction,
  toggleSelectedButton,
  updatedList,
  updateListForTogglingRecords,
  updateToggleSelectedAction,
  updateToggleSelectedTabText
};
