import { getRecordData, toggleContainerClass, viewingFullRecord } from '../../../record/layout.js';
import { inTemporaryList, setTemporaryList, viewingTemporaryList } from '../../../list/layout.js';
import { filterSelectedRecords } from '../../../list/partials/list-item/_checkbox.js';
import toggleBanner from '../../../list/partials/_go-to.js';
import { toggleTabDisplay } from '../../_actions.js';

const fetchAndAddRecord = async ({ list, recordDatastore, recordId }) => {
  const updatedList = { ...list };

  try {
    const response = await fetch(`/${recordDatastore}/record/${recordId}/brief`);
    if (!response.ok) {
      // Return the original list if the fetch fails
      return updatedList;
    }
    // Add the record information to the list
    const data = await response.json();
    updatedList[recordDatastore][recordId] = data;
  } catch {
    // Silent failure, so no action is needed
    return updatedList;
  }

  return updatedList;
};

const handleAddFullRecord = async ({ addRecord = fetchAndAddRecord, inList = inTemporaryList(), list, recordData = getRecordData(), toggleClass = toggleContainerClass }) => {
  let updatedList = { ...list };

  try {
    updatedList = await addRecord({ list: updatedList, ...recordData });
  } finally {
    // Check if the record is in the list, in case it failed to be added
    const isInList = inList({ list: updatedList, ...recordData });

    // Toggle class
    toggleClass({ isAdded: isInList, ...recordData });

    // Toggle the add selected tab
    toggleTabDisplay({ showTab: !isInList, tab: 'actions__add-selected' });

    // Toggle the remove selected tab
    toggleTabDisplay({ showTab: isInList, tab: 'actions__remove-selected' });
  }

  return updatedList;
};

const handleAddMultipleRecords = ({ addRecord = fetchAndAddRecord, checkedValues = filterSelectedRecords(), inList = inTemporaryList(), list, toggleClass = toggleContainerClass }) => {
  let updatedList = { ...list };

  checkedValues.forEach(async (checkedValue) => {
    const [recordDatastore, recordId] = checkedValue.split(',');
    if (!inList({ list, recordDatastore, recordId })) {
      try {
        updatedList = await addRecord({ list: updatedList, recordDatastore, recordId });
      } finally {
        // Toggle class
        toggleClass({ isAdded: inList({ list: updatedList, recordDatastore, recordId }), recordDatastore, recordId });
        // Toggle tabs??
      }
    }
  });

  return updatedList;
};

const updateListFuncs = {
  handleAddFullRecord,
  handleAddMultipleRecords,
  setTemporaryList,
  viewingFullRecord
};

const updateUIFuncs = {
  toggleBanner,
  toggleTabDisplay
};

const addSelectedAction = ({
  list,
  updateList = updateListFuncs,
  updateUI = updateUIFuncs
} = {}) => {
  let updatedList = { ...list };
  
  // Update the list when the add selected button is clicked
  document.querySelector('button.action__add-selected').addEventListener('click', async () => {
    if (updateList.viewingFullRecord()) {
      updatedList = await updateList.handleAddFullRecord({ list: updatedList });
    } else {
      updatedList = await updateList.handleAddMultipleRecords({ list: updatedList });
    }

    // Set `sessionStorage`
    updateList.setTemporaryList(updatedList);

    // Update the UI
    // Toggle the banner
    const temporaryListCount = Object.values(updatedList).reduce((sum, datastore) => {
      return sum + Object.keys(datastore).length;
    }, 0);
    updateUI.toggleBanner(temporaryListCount);
    // Hide the tab
    updateUI.toggleTabDisplay({ showTab: false, tab: 'actions__add-selected' });
    // Show remove selected tab
    updateUI.toggleTabDisplay({ showTab: true, tab: 'actions__remove-selected' });
  });
};

const addSelected = ({ isTemporaryList = viewingTemporaryList(), toggleTab = toggleTabDisplay } = {}) => {
  toggleTab({ showTab: !isTemporaryList, tab: 'actions__add-selected' });
  addSelectedAction();
};

export { addSelected, fetchAndAddRecord, addSelectedAction };
