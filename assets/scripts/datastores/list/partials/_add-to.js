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
  const item = sessionStorage.getItem(listName);
  // Return the parsed list or the prefilled object if `temporaryList` does not exist
  return item ? JSON.parse(item) : defaultTemporaryList;
};

const setTemporaryList = (list) => {
  sessionStorage.setItem(listName, JSON.stringify(list));
};

const inTemporaryList = ({ list = getTemporaryList(), recordDatastore, recordId }) => {
  return (
    // Check that the datastore is in the list
    recordDatastore in list
    // Make sure the datastore is an object and not null
    && (typeof list[recordDatastore] === 'object' && list[recordDatastore] !== null)
    // Check that the record ID exists in the datastore
    && recordId in list[recordDatastore]
  );
};

const temporaryListCount = (list = getTemporaryList()) => {
  // Count the total number of records across all datastores
  return Object.values(list).reduce((sum, datastore) => {
    return sum + Object.keys(datastore).length;
  }, 0);
};

const updateResultUI = (form, updateButton = updateButtonUI) => {
  // Check if the record is already in the list
  const { recordDatastore, recordId } = form.dataset;
  const isAdded = inTemporaryList({ recordDatastore, recordId });
  // Update the container class
  toggleContainerClass({ isAdded, recordDatastore, recordId });
  // Update the button
  updateButton({ button: form.querySelector('button'), isAdded });
  // Toggle the banner
  toggleBanner(temporaryListCount());
};

const handleFormSubmit = async (event) => {
  const form = event.target;

  if (!form.matches('.list__add-to')) {
    return;
  }

  event.preventDefault();

  const { recordDatastore, recordId } = form.dataset;
  const list = getTemporaryList();

  if (inTemporaryList({ recordDatastore, recordId })) {
    // If the record is already in the list, remove it
    delete list[recordDatastore][recordId];
  } else {
    try {
      const response = await fetch(form.getAttribute('action'));
      if (!response.ok) {
        // Do not add to the list if the fetch fails
        return;
      }
      // Add the record information to the list
      const data = await response.json();
      list[recordDatastore][recordId] = data;
    } catch {
      // Silent failure, so no action is needed
      return;
    }
  }

  setTemporaryList(list);
  updateResultUI(form);
};

const addToList = (updateResult = updateResultUI) => {
  // ADD GETTEMPORARYLIST HERE TO PASS THROUGH
  document.body.addEventListener('submit', handleFormSubmit);

  // Initial UI update for all buttons
  const forms = document.querySelectorAll('.list__add-to');
  forms.forEach((form) => {
    // `updateResult` is passed in for testing purposes
    updateResult(form);
  });
};

export {
  addToList,
  defaultTemporaryList,
  getTemporaryList,
  handleFormSubmit,
  inTemporaryList,
  setTemporaryList,
  temporaryListCount,
  toggleContainerClass,
  updateResultUI
};
