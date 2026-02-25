import { selectAllCheckboxState, updateSelectedCount } from '../partials/_select-all.js';
import { actionsPanelText } from '../partials/actions/_summary.js';
import { disableActionTabs } from '../partials/_actions.js';
import { displayCSLData } from '../partials/actions/action/citation/_csl.js';
import { listItem } from './partials/_list-item.js';
import { regenerateCitations } from '../partials/actions/action/_citation.js';

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
  return datastores({ empty: false, list }).length === 0;
};

const temporaryListCount = ({ list }) => {
  return Object.values(list).reduce((sum, datastore) => {
    return sum + Object.keys(datastore).length;
  }, 0);
};

const toggleListElements = ({ list }) => {
  const lists = document.querySelector('.datastore-lists');
  const emptyList = document.querySelector('.list__empty');

  // Check if elements should be visible or not based on temporary list being empty
  if (isTemporaryListEmpty({ list })) {
    // Hide Actions when there are no saved records
    lists.style.display = 'none';
    // Show the empty message when there are no saved records
    emptyList.removeAttribute('style');
  } else {
    // Show Actions when there are saved records
    lists.removeAttribute('style');
    // Hide the empty message when there are saved records
    emptyList.style.display = 'none';
  }
};

const datastoreHeading = (datastore) => {
  const heading = document.createElement('h2');
  // Capitalize first letter and replace underscores with spaces
  let datastoreText = datastore.charAt(0).toUpperCase() + datastore.slice(1);
  if (datastore === 'guidesandmore') {
    datastoreText = 'Guides and More';
  }
  if (datastore === 'onlinejournals') {
    datastoreText = 'Online Journals';
  }
  heading.textContent = datastoreText;
  return heading;
};

const createDatastoreList = (list) => {
  // Get the list container
  const listContainer = document.querySelector('.list');
  // Create an ordered list for each non-empty datastore
  getDatastores({ list }).forEach((datastore) => {
    // Create heading
    listContainer.appendChild(datastoreHeading(datastore));
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
  listFunctions.toggleListElements(list);

  // Build the list DOM
  listFunctions.createDatastoreList(list);

  // Return early if My Temporary List is empty
  if (isTemporaryListEmpty({ list })) {
    return;
  }

  listFunctions.initializeNonEmptyListFunctions({ list });
};

export {
  createDatastoreList,
  datastoreHeading,
  defaultTemporaryList,
  getDatastores,
  getSessionStorage,
  handleSelectionChange,
  initializeNonEmptyListFunctions,
  inTemporaryList,
  isTemporaryListEmpty,
  setSessionStorage,
  temporaryList,
  temporaryListCount,
  toggleListElements,
  viewingTemporaryList
};
