import { actionsPanelText } from '../partials/actions/_summary.js';
import { disableActionTabs } from '../partials/_actions.js';
import { displayCSLData } from '../partials/actions/action/citation/_csl.js';
import { listItem } from './partials/_list-item.js';
import { regenerateCitations } from '../partials/actions/action/_citation.js';
import { selectAllState } from './partials/_select-all.js';
import { selectedText } from './partials/_in-list.js';

const viewingTemporaryList = () => {
  return window.location.pathname === '/everything/list';
};

const isTemporaryListEmpty = (list) => {
  // Use for...in loop for fastest performance
  for (const datastore in list) {
    // Check if any of the datastores have records saved to them
    if (Object.keys(list[datastore]).length > 0) {
      // Exit early if non-empty found
      return false;
    }
  }

  return true;
};

const nonEmptyDatastores = (list) => {
  return Object.keys(list).filter((datastore) => {
    return Object.keys(list[datastore]).length > 0;
  });
};

const toggleListElements = (list) => {
  const listActions = document.querySelector('.list__actions');
  const emptyList = document.querySelector('.list__empty');

  // Check if elements should be visible or not based on temporary list being empty
  if (isTemporaryListEmpty(list)) {
    // Hide Actions when there are no saved records
    listActions.style.display = 'none';
    // Show the empty message when there are no saved records
    emptyList.removeAttribute('style');
  } else {
    // Show Actions when there are saved records
    listActions.removeAttribute('style');
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
  nonEmptyDatastores(list).forEach((datastore) => {
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
  selectAllState,
  selectedText: () => {
    return selectedText();
  }
};

const handleSelectionChange = (actions) => {
  // Watch for changes to the list and update accordingly
  document.querySelector('.list').addEventListener('change', (event) => {
    if (event.target.matches(`input[type="checkbox"].list__item--checkbox, .select-all > input[type="checkbox"]`)) {
      actions.selectedText();
      actions.actionsPanelText();
      actions.selectAllState();
      actions.disableActionTabs();
      actions.displayCSLData();
      actions.regenerateCitations();
    }
  });
};

const initializeNonEmptyListFunctions = (actions = defaultActions, handleChange = handleSelectionChange) => {
  // Update Actions panel
  actions.selectedText();
  actions.actionsPanelText();
  actions.displayCSLData();

  // `handleChange` is passed in for testing purposes
  handleChange(actions);
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
  if (isTemporaryListEmpty(list)) {
    return;
  }

  listFunctions.initializeNonEmptyListFunctions();
};

export { createDatastoreList, datastoreHeading, handleSelectionChange, initializeNonEmptyListFunctions, isTemporaryListEmpty, nonEmptyDatastores, temporaryList, toggleListElements, viewingTemporaryList };
