import { handleActionsPanelChange, initializeActions } from '../partials/_actions.js';
import { removeEmptyDatastoreSections } from './partials/results/_datastores.js';
import { removeEmptyListMessage } from './partials/_empty.js';
import { removeListResults } from './partials/_results.js';
import { selectAll } from '../partials/_select-all.js';
import { updateResultsLists } from '../results/partials/_results-list.js';

const defaultTemporaryList = {
  articles: {},
  catalog: {},
  databases: {},
  everything: {},
  guidesandmore: {},
  onlinejournals: {}
};

const getSessionStorage = ({ defaultValue, itemName }) => {
  // Check if a default value was provided
  if (!defaultValue) {
    throw new Error('`defaultValue` is required');
  };

  // Check if an item name was provided
  if (!itemName) {
    throw new Error('`itemName` is required');
  };

  try {
    // Get session storage
    const item = sessionStorage.getItem(itemName);
    // Throw if `item` is falsy, or returned problematic string values
    if (!item || ['undefined', 'null'].includes(item)) {
      throw new Error('Invalid `sessionStorage` value');
    }
    // Parse and return the list
    return JSON.parse(item);
  } catch {
    // Return the default list if there are any issues with session storage
    return defaultValue;
  }
};

const setSessionStorage = ({ itemName, value }) => {
  // Check if an item name was provided
  if (!itemName) {
    throw new Error('`itemName` is required');
  }

  // Check if a value was provided
  if (!value) {
    throw new Error('`value` is required');
  }

  // Set session storage
  sessionStorage.setItem(itemName, JSON.stringify(value));
};

const viewingTemporaryList = () => {
  return window.location.pathname === '/everything/list';
};

const getDatastores = ({ empty = false, list }) => {
  return Object.keys(list).filter((datastore) => {
    if (empty) {
      return Object.keys(list[datastore]).length === 0;
    }
    return Object.keys(list[datastore]).length > 0;
  });
};

const inTemporaryList = ({ list, recordDatastore, recordId }) => {
  // Check that the datastore exists in the list, and the record ID exists within the datastore
  return Boolean(list?.[recordDatastore]?.[recordId]);
};

const toggleListElements = ({
  datastores = getDatastores,
  list,
  removeEmptyMessage = removeEmptyListMessage,
  removeLists = removeEmptyDatastoreSections,
  removeResults = removeListResults
} = {}) => {
  // Get all datastores that are not empty
  const nonEmptyDatastores = datastores({ list });

  // Check if the temporary list is empty
  if (nonEmptyDatastores.length === 0) {
    // Remove the list results from the DOM
    removeResults();
  } else {
    // Remove all empty datastore sections
    removeLists({ datastores: nonEmptyDatastores });

    // Remove the empty message from the DOM
    removeEmptyMessage();
  }
};

const temporaryList = ({
  actionsPanel = initializeActions,
  datastores = getDatastores,
  handleActionsChange = handleActionsPanelChange,
  initializeSelectAll = selectAll,
  list,
  toggleElements = toggleListElements,
  updateResults = updateResultsLists
} = {}) => {
  // Toggle what should and should not be displaying
  toggleElements({ list });

  // Build the list DOM
  updateResults({ list });

  // Return early if My Temporary List is empty
  if (datastores({ list }).length === 0) {
    return;
  }

  // Actions panel
  actionsPanel({ list });

  // Initialize select all partial
  initializeSelectAll();

  // Watch for changes to the list and update accordingly
  handleActionsChange({ element: document.querySelector('.list') });
};

export {
  defaultTemporaryList,
  getDatastores,
  getSessionStorage,
  inTemporaryList,
  setSessionStorage,
  temporaryList,
  toggleListElements,
  viewingTemporaryList
};
