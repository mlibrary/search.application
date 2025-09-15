import changeCount from './partials/_in-list.js';
import { getTemporaryList } from './partials/_add-to.js';
import { listItem } from './partials/_list-item.js';
import { selectAllState } from './partials/_select-all.js';

const className = 'list__items';
const checkboxSelector = 'input[type="checkbox"].list__item--checkbox';

const getCheckboxes = () => {
  return document.querySelectorAll(`ol.${className} ${checkboxSelector}`);
};

const someCheckboxesChecked = (checked = false) => {
  return [...getCheckboxes()].some((checkbox) => {
    return checkbox.checked === checked;
  });
};

const filterSelectedRecordIDs = () => {
  return [...getCheckboxes()].filter((checkbox) => {
    return checkbox.checked === true;
  }).map((checkbox) => {
    return checkbox.value;
  });
};

const temporaryList = () => {
  const list = getTemporaryList();
  const recordIds = Object.keys(list);
  const listCount = recordIds.length;
  const emptyList = document.querySelector('.list__empty');
  const listActions = document.querySelector('.list__actions');

  // Update in list count
  changeCount(listCount);

  // Toggle empty message and actions panel
  if (listCount) {
    emptyList.style.display = 'none';
    listActions.removeAttribute('style');
  } else {
    emptyList.removeAttribute('style');
    listActions.style.display = 'none';
  }

  // Create temporary list by datastore
  const listContainer = document.querySelector('.list');
  const heading = document.createElement('h2');
  listContainer.appendChild(heading);
  heading.textContent = 'Catalog';
  const listItems = document.createElement('ol');
  listItems.classList.add(className, 'list__no-style');
  listContainer.appendChild(listItems);

  // Display records
  recordIds.forEach((recordId, index) => {
    listItems.appendChild(listItem({ index, record: list[recordId], recordId }));
  });

  // Watch for changes to the list and update accordingly
  listContainer.addEventListener('change', (event) => {
    if (event.target.matches(checkboxSelector)) {
      selectAllState();
      // Actions button state
    }
  });
};

export { filterSelectedRecordIDs, getCheckboxes, someCheckboxesChecked, temporaryList };
