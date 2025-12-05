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
  return (
    // Check that the datastore is in the list
    recordDatastore in list
    // Make sure the datastore is an object and not null
    && (typeof list[recordDatastore] === 'object' && list[recordDatastore] !== null)
    // Check that the record ID exists in the datastore
    && recordId in list[recordDatastore]
  );
};

const temporaryListCount = (list) => {
  // Count the total number of records across all datastores
  return Object.values(list).reduce((sum, datastore) => {
    return sum + Object.keys(datastore).length;
  }, 0);
};

const updateResultUI = ({ form, list, updateButton = updateButtonUI }) => {
  // Check if the record is already in the list
  const { recordDatastore, recordId } = form.dataset;
  const isAdded = inTemporaryList({ list, recordDatastore, recordId });
  // Update the container class
  toggleContainerClass({ isAdded, recordDatastore, recordId });
  // Update the button
  updateButton({ button: form.querySelector('button'), isAdded });
  // Toggle the banner
  toggleBanner(temporaryListCount(list));
};

const handleFormSubmit = async ({ form, list }) => {
  const { recordDatastore, recordId } = form.dataset;
  const currentList = { ...list };

  if (inTemporaryList({ list: currentList, recordDatastore, recordId })) {
    // If the record is already in the list, remove it
    delete currentList[recordDatastore][recordId];
  } else {
    try {
      const response = await fetch(form.getAttribute('action'));
      if (!response.ok) {
        // Do not add to the list if the fetch fails
        return;
      }
      // Add the record information to the list
      const data = await response.json();
      currentList[recordDatastore][recordId] = data;
    } catch {
      // Silent failure, so no action is needed
      return;
    }
  }

  setTemporaryList(currentList);
  updateResultUI({ form, list: currentList });
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

const addToList = (list = getTemporaryList(), initializeAddToButton = initializeAddToList) => {
  // Initialize everything needed for the `Add to...` buttons
  initializeAddToButton({ list });
};

export {
  addToFormSubmit,
  addToFormsUI,
  addToList,
  defaultTemporaryList,
  getTemporaryList,
  handleFormSubmit,
  initializeAddToList,
  inTemporaryList,
  setTemporaryList,
  temporaryListCount,
  toggleContainerClass,
  updateResultUI
};
