import { filterSelectedRecords, getCheckboxes, splitCheckboxValue, toggleCheckedState } from '../../../list/partials/list-item/_checkbox.js';
import { inTemporaryList, setTemporaryList } from '../../../list/layout.js';
import { toggleBanner } from '../../../list/partials/_go-to.js';
import { toggleTabDisplay } from '../../_actions.js';

const getAddSelectedButton = () => {
  return document.querySelector('#actions__add-selected--tabpanel .action__add-selected');
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

const displaySelectedActions = ({ checkedValues = filterSelectedRecords(), inList = inTemporaryList, list, splitValue = splitCheckboxValue, toggleTab = toggleTabDisplay } = {}) => {
  // Check if any of the selected records are not in the temporary list
  const showTab = checkedValues.some((value) => {
    const { recordDatastore, recordId } = splitValue({ value });
    return !inList({ list, recordDatastore, recordId });
  });

  // If `Add selected` is shown, hide `Remove selected`, and vice versa
  toggleTab({ id: 'actions__add-selected', show: showTab });
  toggleTab({ id: 'actions__remove-selected', show: !showTab });
};

const addSelectedAction = ({ addRecords = fetchAndAddRecords, addSelectedButton = getAddSelectedButton(), list, setList = setTemporaryList, showBanner = toggleBanner, styleRecords = styleAddedRecords, toggleActions = displaySelectedActions } = {}) => {
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
      // Re-enable the button
      button.disabled = false;
      // Restore original button text
      button.textContent = buttonText;

      // Set `sessionStorage`
      setList(updatedList);

      // Re-style records after adding
      styleRecords({ list: updatedList });

      // Toggle banner
      showBanner({ list: updatedList });

      // Toggle actions based on current selection
      toggleActions({ list: updatedList });
    }
  });
};

const addSelected = ({ addAction = addSelectedAction, list, showBanner = toggleBanner, styleRecords = styleAddedRecords, toggleActions = displaySelectedActions } = {}) => {
  // Toggle actions based on current selection
  toggleActions({ list });

  // Style records on load
  styleRecords({ list });

  // Show banner if there are items in the temporary list
  showBanner({ list });

  // Initialize the add selected action
  addAction({ list });
};

export {
  addSelected,
  addSelectedAction,
  displaySelectedActions,
  fetchAndAddRecords,
  fetchRecordData,
  getAddSelectedButton,
  styleAddedRecords,
  toggleAddedClass
};
