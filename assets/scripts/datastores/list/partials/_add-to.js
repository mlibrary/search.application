import toggleBanner from './_go-to.js';
import toggleContainerClass from '../../record/layout.js';
import { updateButtonUI } from './add-to/_button.js';

const listName = 'temporaryList';

/* eslint-disable sort-keys */
const defaultTemporaryList = {
  catalog: {},
  articles: {},
  databases: {},
  onlinejournals: {},
  guidesandmore: {}
};
/* eslint-enable sort-keys */

const getTemporaryList = () => {
  // Get session storage
  const item = sessionStorage.getItem(listName);

  // Return the default list if `item` is falsy, or returned problematic string values
  if (!item || item === 'undefined' || item === 'null') {
    return defaultTemporaryList;
  }

  // If failing to parse, return the default list
  try {
    return JSON.parse(item);
  } catch {
    return defaultTemporaryList;
  }
};

const setTemporaryList = (list) => {
  sessionStorage.setItem(listName, JSON.stringify(list));
};

const inTemporaryList = ({ list, recordDatastore, recordId }) => {
  // Check that the datastore exists in the list, and the record ID exists within the datastore
  return Boolean(list?.[recordDatastore]?.[recordId]);
};

const updateUIFuncs = {
  inTemporaryList,
  toggleBanner,
  toggleContainerClass,
  updateButtonUI
};

const updateResultUI = ({ form, list, updateUI = updateUIFuncs }) => {
  // Check if the record is already in the list
  const { recordDatastore, recordId } = form.dataset;
  const isAdded = updateUI.inTemporaryList({ list, recordDatastore, recordId });

  // Update the container class
  updateUI.toggleContainerClass({ isAdded, recordDatastore, recordId });

  // Update the button
  updateUI.updateButtonUI({ button: form.querySelector('button'), isAdded });

  // Toggle the banner
  const temporaryListCount = Object.values(list).reduce((sum, datastore) => {
    return sum + Object.keys(datastore).length;
  }, 0);
  updateUI.toggleBanner(temporaryListCount);
};

const removeRecordFromList = ({ list, recordDatastore, recordId }) => {
  const updatedList = { ...list };
  if (updatedList[recordDatastore] && updatedList[recordDatastore][recordId]) {
    delete updatedList[recordDatastore][recordId];
  }
  return updatedList;
};

const fetchAndAddRecord = async ({ list, recordDatastore, recordId, url }) => {
  const updatedList = { ...list };

  try {
    const response = await fetch(url);
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

const formSubmitFuncs = {
  fetchAndAddRecord,
  inTemporaryList,
  removeRecordFromList,
  setTemporaryList,
  updateResultUI
};

const handleFormSubmit = async ({ form, list, submitFuncs = formSubmitFuncs }) => {
  const { recordDatastore, recordId } = form.dataset;
  let updatedList = { ...list };

  // Update the list
  if (submitFuncs.inTemporaryList({ list: updatedList, recordDatastore, recordId })) {
    // If the record is already in the list, remove it
    updatedList = submitFuncs.removeRecordFromList({ list: updatedList, recordDatastore, recordId });
  } else {
    // Add the record to the list
    updatedList = await submitFuncs.fetchAndAddRecord({ list: updatedList, recordDatastore, recordId, url: form.action });
  }

  // Set `sessionStorage`
  submitFuncs.setTemporaryList(updatedList);

  // Update the UI
  submitFuncs.updateResultUI({ form, list: updatedList });
};

const addToFormSubmit = ({ list, handleSubmit = handleFormSubmit }) => {
  // Listen for form submits
  document.body.addEventListener('submit', (event) => {
    // Get the form
    const form = event.target;

    // Return if it's not the correct form
    if (!form.matches('.list__add-to')) {
      return;
    }

    event.preventDefault();

    handleSubmit({ form, list });
  });
};

const addToFormsUI = ({ list, updateResult = updateResultUI }) => {
  // Initial UI update for all buttons
  const forms = document.querySelectorAll('.list__add-to');
  forms.forEach((form) => {
    // `updateResult` is passed in for testing purposes
    updateResult({ form, list });
  });
};

const initializeAddToList = ({ addToFuncs = { addToFormSubmit, addToFormsUI }, list }) => {
  // Initialize all functions
  Object.keys(addToFuncs).forEach((addToFunc) => {
    addToFuncs[addToFunc]({ list });
  });
};

const addToList = ({ initializeAddToButton = initializeAddToList, list }) => {
  // Initialize everything needed for the `Add to...` buttons
  initializeAddToButton({ list });
};

export {
  addToFormSubmit,
  addToFormsUI,
  addToList,
  defaultTemporaryList,
  fetchAndAddRecord,
  getTemporaryList,
  handleFormSubmit,
  initializeAddToList,
  inTemporaryList,
  removeRecordFromList,
  setTemporaryList,
  toggleContainerClass,
  updateResultUI
};
