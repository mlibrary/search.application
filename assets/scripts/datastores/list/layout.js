import { actionsPanelText } from '../partials/actions/_summary.js';
import { disableActionTabs } from '../partials/_actions.js';
import { displayCSLData } from '../partials/actions/action/_citation.js';
import { getTemporaryList } from './partials/_add-to.js';
import { listItem } from './partials/_list-item.js';
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

const temporaryList = () => {
  const list = getTemporaryList();

  // Toggle what should and should not be displaying
  toggleListElements(list);

  if (!isTemporaryListEmpty(list)) {
    // Create temporary list by datastore
    const listContainer = document.querySelector('.list');
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

    // Update Actions panel
    actionsPanelText();
    displayCSLData();
    selectedText();

    // Watch for changes to the list and update accordingly
    listContainer.addEventListener('change', (event) => {
      if (event.target.matches(`input[type="checkbox"].list__item--checkbox, .select-all > input[type="checkbox"]`)) {
        actionsPanelText();
        disableActionTabs();
        displayCSLData();
        selectAllState();
        selectedText();
      }
    });
  }
};

export { datastoreHeading, isTemporaryListEmpty, nonEmptyDatastores, temporaryList, toggleListElements, viewingTemporaryList };
