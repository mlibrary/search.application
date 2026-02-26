import { selectAllCheckboxState, updateSelectedCount } from '../partials/_select-all.js';
import { actionsPanelText } from '../partials/actions/_summary.js';
import { disableActionTabs } from '../partials/_actions.js';
import { displayCSLData } from '../partials/actions/action/citation/_csl.js';
import { listItem } from './partials/_list-item.js';
import { regenerateCitations } from '../partials/actions/action/_citation.js';
import { removeEmptyDatastoreSections } from './partials/results/_datastores.js';
import { removeEmptyListMessage } from './partials/_empty.js';
import { removeListResults } from './partials/_results.js';

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

const isTemporaryListEmpty = ({ datastores = getDatastores, list }) => {
  return datastores({ list }).length === 0;
};

const toggleListElements = ({
  list,
  nonEmptyDatastores = getDatastores({ list }),
  removeEmptyMessage = removeEmptyListMessage,
  removeLists = removeEmptyDatastoreSections,
  removeResults = removeListResults
} = {}) => {
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

const createDatastoreList = ({ list }) => {
  // Get the list container
  const listContainer = document.querySelector('.list');
  // Create an ordered list for each non-empty datastore
  getDatastores({ list }).forEach((datastore) => {
    // Create list container
    const listItems = document.createElement('ol');
    listItems.classList.add('list__items', 'list__no-style');
    listContainer.appendChild(listItems);
    // Display records
    Object.keys(list[datastore]).forEach((recordId, index) => {
      listItems.appendChild(listItem({ datastore, index, record: list[datastore][recordId], recordId }));
    });
  });
};

// Bring in actions after DOM has been built
const defaultActions = {
  actionsPanelText,
  disableActionTabs: () => {
    return disableActionTabs();
  },
  displayCSLData,
  regenerateCitations,
  selectAllCheckboxState,
  updateSelectedCount
};

const handleSelectionChange = ({ actions, list }) => {
  // Watch for changes to the list and update accordingly
  document.querySelector('.list').addEventListener('change', (event) => {
    if (event.target.matches(`input[type="checkbox"].record__checkbox, input[type="checkbox"].select-all__checkbox`)) {
      actions.actionsPanelText();
      actions.selectAllCheckboxState();
      actions.updateSelectedCount();
      actions.disableActionTabs();
      actions.displayCSLData({ list });
      actions.regenerateCitations();
    }
  });
};

const initializeNonEmptyListFunctions = ({ actions = defaultActions, handleChange = handleSelectionChange, list } = {}) => {
  // Update Actions panel
  actions.actionsPanelText();
  actions.displayCSLData({ list });

  // `handleChange` is passed in for testing purposes
  handleChange({ actions, list });
};

const temporaryListFunctions = {
  createDatastoreList,
  initializeNonEmptyListFunctions,
  toggleListElements
};

const temporaryList = ({ list, listFunctions = temporaryListFunctions } = {}) => {
  // Toggle what should and should not be displaying
  listFunctions.toggleListElements({ list });

  // Build the list DOM
  listFunctions.createDatastoreList({ list });

  // Return early if My Temporary List is empty
  if (isTemporaryListEmpty({ list })) {
    return;
  }

  listFunctions.initializeNonEmptyListFunctions({ list });
};

export {
  createDatastoreList,
  defaultTemporaryList,
  getDatastores,
  getSessionStorage,
  handleSelectionChange,
  initializeNonEmptyListFunctions,
  inTemporaryList,
  isTemporaryListEmpty,
  setSessionStorage,
  temporaryList,
  toggleListElements,
  viewingTemporaryList
};
