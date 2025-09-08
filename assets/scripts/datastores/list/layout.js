import changeCount from './partials/_in-list.js';
import { disableDeselectAllButton } from './partials/_deselect-all.js';
import { disableRemoveSelectedButton } from './partials/_remove-selected.js';
import { disableSelectAllButton } from './partials/_select-all.js';
import { getTemporaryList } from './partials/_add-to.js';
import { listItem } from './partials/_list-item.js';

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

  // Update in list count
  changeCount(listCount);

  // Toggle empty message
  if (listCount) {
    emptyList.style.display = 'none';
  } else {
    emptyList.removeAttribute('style');
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
      disableSelectAllButton();
      disableDeselectAllButton();
      disableRemoveSelectedButton();
    }
  });
};

export { filterSelectedRecordIDs, getCheckboxes, someCheckboxesChecked, temporaryList };
