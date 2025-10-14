import { filterSelectedRecords, getCheckboxes, someCheckboxesChecked } from './partials/list-item/_checkbox.js';
import { actionsPanelText } from '../partials/actions/_summary.js';
import { displayCSLData } from '../partials/actions/action/_citation.js';
import { getTemporaryList } from './partials/_add-to.js';
import { listItem } from './partials/_list-item.js';
import { selectAllState } from './partials/_select-all.js';

const viewingTemporaryList = () => {
  return window.location.pathname === '/everything/list';
};

const disableActionTabs = () => {
  const someChecked = someCheckboxesChecked(true);
  const tabs = document.querySelectorAll('.actions__tablist button[role="tab"]');
  tabs.forEach((tab) => {
    if (!someChecked) {
      if (tab.getAttribute('aria-selected') === 'true') {
        tab.click();
      }
    }
    tab.disabled = !someChecked;
  });
};

const selectedText = () => {
  const summaryText = document.querySelector('.list__actions--utilities .list__in-list');
  const totalCount = getCheckboxes().length;
  const recordText = totalCount === 1 ? 'item' : 'items';
  summaryText.innerHTML = `<span class="strong">${filterSelectedRecords().length}</span> out of <span class="strong">${totalCount}</span> ${recordText} selected.`;
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
  const nonEmptyDatastores = Object.keys(list).filter((datastore) => {
    return Object.keys(list[datastore]).length > 0;
  });
  const emptyList = document.querySelector('.list__empty');
  const listActions = document.querySelector('.list__actions');

  // Toggle empty message and actions panel
  if (nonEmptyDatastores.length) {
    emptyList.style.display = 'none';
    listActions.removeAttribute('style');

    // Create temporary list by datastore
    const listContainer = document.querySelector('.list');
    Object.keys(list).forEach((datastore) => {
      // Check if there are records for this datastore
      if (Object.keys(list[datastore]).length > 0) {
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
      }
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
  } else {
    emptyList.removeAttribute('style');
    listActions.style.display = 'none';
  }
};

export { datastoreHeading, disableActionTabs, selectedText, temporaryList, viewingTemporaryList };
