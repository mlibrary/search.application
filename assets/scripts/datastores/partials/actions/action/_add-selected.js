import { filterSelectedRecords, getCheckboxes, getCheckedCheckboxes, splitCheckboxValue, toggleCheckedState } from '../../../list/partials/list-item/_checkbox.js';
import { inTemporaryList, setTemporaryList } from '../../../list/layout.js';
import { displayRemoveSelectedAction } from './_remove-selected.js';
import { toggleBanner } from '../../../list/partials/_go-to.js';
import { toggleTabDisplay } from '../../_actions.js';

const addSelectedClass = 'actions__add-selected';

const getAddSelectedButton = () => {
  return document.querySelector(`#${addSelectedClass}--tabpanel .action__add-selected`);
};

const toggleSelectedTabText = ({ checkedCheckboxes = getCheckedCheckboxes(), tabID = addSelectedClass } = {}) => {
  // Get the tab element
  const tab = document.getElementById(tabID);

  // Return early if the tab is not found
  if (!tab) {
    return;
  }

  // Replace `selected` with `record` if there is only one checkbox selected, and vice versa
  const updatedText = tab.textContent.replace(
    /(?:selected|record)/u,
    checkedCheckboxes.length === 1 ? 'record' : 'selected'
  );

  // Update the tab's text content
  tab.textContent = updatedText;
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

const styleAddedRecords = ({ checkboxes = getCheckboxes(), inList = inTemporaryList, list, splitValue = splitCheckboxValue, toggleClass = toggleAddedClass, toggleChecked = toggleCheckedState }) => {
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

const fetchAndAddRecords = async ({ addClass = toggleAddedClass, checkboxValues = filterSelectedRecords(), fetchRecord = fetchRecordData, list, splitValue = splitCheckboxValue }) => {
  // Create a shallow copy of the list to update
  const updatedList = { ...list };

  // Run all fetches and collect their results
  await Promise.all(
    checkboxValues.map(async (value) => {
      // Get the record's datastore and ID
      const { recordDatastore, recordId } = splitValue({ value });

      try {
        // Fetch the record data
        const recordData = await fetchRecord({ recordDatastore, recordId });

        // Add the fetched record data to the datastore in the final list
        updatedList[recordDatastore] = { ...(updatedList[recordDatastore] || {}), ...recordData };

        // Add the class to visually indicate the record is in the temporary list
        addClass({ isAdded: true, recordDatastore, recordId });
      } catch {
        // Silent failure, so no action is needed
      }
    })
  );

  return updatedList;
};

const displayAddSelectedAction = ({ checkedValues = filterSelectedRecords(), inList = inTemporaryList, list, splitValue = splitCheckboxValue, toggleTab = toggleTabDisplay } = {}) => {
  // Check if any of the selected records are not in the temporary list
  const showTab = checkedValues.some((value) => {
    const { recordDatastore, recordId } = splitValue({ value });
    return !inList({ list, recordDatastore, recordId });
  });

  // Show `Add selected` if there are selected records not already in the temporary list
  toggleTab({ id: addSelectedClass, show: showTab });
};

const addSelectedAction = ({
  addRecords = fetchAndAddRecords,
  addSelectedButton = getAddSelectedButton(),
  displayAddAction = displayAddSelectedAction,
  displayRemoveAction = displayRemoveSelectedAction,
  list,
  setList = setTemporaryList,
  showBanner = toggleBanner,
  styleRecords = styleAddedRecords
} = {}) => {
  const button = addSelectedButton;
  const buttonText = button.textContent;

  let updatedList = { ...list };

  button.addEventListener('click', async () => {
    // Disable the button while processing to prevent multiple clicks
    button.disabled = true;
    // Update button text to indicate processing
    button.textContent = 'Adding...';
    try {
      // Fetch and add the selected records
      const addedRecords = await addRecords({ list: updatedList });
      // Merge added records into the updated list
      updatedList = { ...updatedList, ...addedRecords };
    } catch {
      // Silent failure, so no action is needed
    } finally {
      // Set the updated list
      setList(updatedList);

      // Re-style records after adding
      styleRecords({ list: updatedList });

      // Update the banner to reflect the new count of items in the list
      showBanner({ list: updatedList });

      // Toggle the display of the `Add selected` action based on the updated list
      displayAddAction({ list: updatedList });

      // Toggle the display of the `Remove selected` action based on the updated list
      displayRemoveAction({ list: updatedList });

      // Restore original button text
      button.textContent = buttonText;
      // Re-enable the button
      button.disabled = false;
    }
  });
};

const addSelected = ({ addAction = addSelectedAction, list, selectedTabText = toggleSelectedTabText, styleRecords = styleAddedRecords, toggleAction = displayAddSelectedAction } = {}) => {
  // Toggle `Add selected` action based on current selection
  toggleAction({ list });

  // Style records on load
  styleRecords({ list });

  // Update the "Add selected" tab text on load and whenever checkboxes are changed
  selectedTabText();

  // Initialize the add selected action
  addAction({ list });
};

export {
  addSelected,
  addSelectedAction,
  displayAddSelectedAction,
  fetchAndAddRecords,
  fetchRecordData,
  getAddSelectedButton,
  styleAddedRecords,
  toggleAddedClass,
  toggleSelectedTabText
};
