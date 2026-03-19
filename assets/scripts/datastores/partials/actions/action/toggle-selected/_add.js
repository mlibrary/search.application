import { filterSelectedRecords, getCheckboxes, splitCheckboxValue, toggleCheckedState } from '../../../../results/partials/results-list/list-item/header/_checkbox.js';
import { getToggleSelectedTab, toggleSelectedButton, updatedList, updateListForTogglingRecords, updateToggleSelectedAction } from '../_toggle-selected.js';
import { inTemporaryList, setSessionStorage } from '../../../../list/layout.js';
import { temporaryListBanner } from '../../../../list/partials/_go-to.js';

const getAddSelectedButton = () => {
  return document.querySelector(`#actions__toggle-selected--tabpanel .action__toggle-selected--add`);
};

const toggleAddedClass = ({ isAdded, recordDatastore, recordId }) => {
  const className = 'record__container';
  const container = document.querySelector(`.${className}[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);

  // Return early if the container is not found
  if (!container) {
    return;
  }

  // Toggle the class to visually indicate the record is in the temporary list
  container.classList.toggle(`${className}--in-temporary-list`, isAdded);
};

const styleAddedRecords = ({
  checkboxes = getCheckboxes(),
  inList = inTemporaryList,
  list = updatedList,
  splitValue = splitCheckboxValue,
  toggleClass = toggleAddedClass,
  toggleChecked = toggleCheckedState
} = {}) => {
  // Loop through records
  checkboxes.forEach((checkbox) => {
    const { recordDatastore, recordId } = splitValue({ value: checkbox.value });
    const isAdded = inList({ list, recordDatastore, recordId });

    // Add the class, if in list
    toggleClass({ isAdded, recordDatastore, recordId });

    // Check the checkbox, if in list
    toggleChecked({ checkbox, isAdded });
  });
};

const fetchRecordData = async ({ recordDatastore, recordId }) => {
  try {
    // Fetch the brief record information
    const response = await fetch(`/${recordDatastore}/record/${recordId}/brief`);
    if (!response.ok) {
      // Return an empty object on failure
      return {};
    }
    // Get the record data
    const data = await response.json();
    // Return the record data in an object keyed by record ID
    return { [recordId]: data };
  } catch {
    // Return an empty object on failure
    return {};
  }
};

const fetchAndAddRecords = async ({
  addClass = toggleAddedClass,
  checkboxValues = filterSelectedRecords(),
  fetchRecord = fetchRecordData,
  list = updatedList,
  splitValue = splitCheckboxValue
}) => {
  // Create a shallow copy of the list to update
  const copiedList = { ...list };

  // Run all fetches and collect their results
  await Promise.all(
    checkboxValues.map(async (value) => {
      // Get the record's datastore and ID
      const { recordDatastore, recordId } = splitValue({ value });

      try {
        // Fetch the record data
        const recordData = await fetchRecord({ recordDatastore, recordId });

        // Add the fetched record data to the datastore in the final list
        copiedList[recordDatastore] = { ...(copiedList[recordDatastore] || {}), ...recordData };

        // Add the class to visually indicate the record is in the temporary list
        addClass({ isAdded: true, recordDatastore, recordId });
      } catch {
        // Silent failure, so no action is needed
      }
    })
  );

  return copiedList;
};

const handleAddSelectedClick = async ({
  addRecords = fetchAndAddRecords,
  event,
  list = updatedList,
  setList = setSessionStorage,
  showBanner = temporaryListBanner,
  styleRecords = styleAddedRecords,
  toggleAddButton = toggleSelectedButton,
  toggleSelectedTab = getToggleSelectedTab(),
  updateList = updateListForTogglingRecords,
  updateToggleSelected = updateToggleSelectedAction
} = {}) => {
  const button = event.target;
  const originalText = button.textContent;
  const toggleAddButtonArgs = { button, disabled: true, originalText, text: 'Adding...' };

  let copiedList = { ...list };

  // Disable the button and change the text to indicate that the addition is in progress
  toggleAddButton(toggleAddButtonArgs);

  try {
    // Fetch and add the selected records
    const addedRecords = await addRecords({ list });
    // Merge added records into the updated list
    copiedList = { ...list, ...addedRecords };
  } catch {
    // Silent failure, so no action is needed
  } finally {
    // Set the updated list
    setList({ itemName: 'temporaryList', value: copiedList });

    // Update the list for adding records
    updateList({ list: copiedList });

    // Re-style records after adding
    styleRecords({ list: copiedList });

    // Enable the button and change the text back to the original text after the addition is complete
    toggleAddButton({ ...toggleAddButtonArgs, disabled: false });

    // Update the toggle selected action
    updateToggleSelected({ list: copiedList });

    // Update the banner to reflect the new count of items in the list
    showBanner({ list: copiedList });

    // Click the tab to close the tab panel after adding records
    toggleSelectedTab.click();
  }
};

const addSelectedAction = ({
  button = getAddSelectedButton(),
  handleAddSelected = handleAddSelectedClick
} = {}) => {
  // Add click event listener to the add selected button
  button.addEventListener('click', async (event) => {
    // Handle the add selected action
    await handleAddSelected({ event });
  });
};

const addSelected = ({
  addAction = addSelectedAction,
  styleRecords = styleAddedRecords
} = {}) => {
  // Style records on load
  styleRecords();

  // Initialize the add selected action
  addAction();
};

export {
  addSelected,
  addSelectedAction,
  fetchAndAddRecords,
  fetchRecordData,
  getAddSelectedButton,
  handleAddSelectedClick,
  styleAddedRecords,
  toggleAddedClass
};
