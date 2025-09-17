import { getTemporaryList } from './partials/_add-to.js';
import { listItem } from './partials/_list-item.js';
import { selectAllState } from './partials/_select-all.js';

const className = 'list__items';
const checkboxSelector = 'input[type="checkbox"].list__item--checkbox';

const getCheckboxes = () => {
  return document.querySelectorAll(`ol.${className} ${checkboxSelector}`);
};

const filterSelectedRecordIDs = () => {
  return [...getCheckboxes()].filter((checkbox) => {
    return checkbox.checked === true;
  }).map((checkbox) => {
    return checkbox.value;
  });
};

const someCheckboxesChecked = (checked = false) => {
  return [...getCheckboxes()].some((checkbox) => {
    return checkbox.checked === checked;
  });
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

const actionsPanelText = () => {
  const summaryText = document.querySelector('.actions__summary--header > small');
  const selectedCount = filterSelectedRecordIDs().length;
  const recordText = selectedCount === 1 ? 'record' : 'records';
  summaryText.textContent = selectedCount ? `Choose what to do with the selected ${recordText}.` : 'Select at least one record.';
};

const selectedText = () => {
  const summaryText = document.querySelector('.list__actions--utilities .list__in-list');
  const totalCount = getCheckboxes().length;
  const recordText = totalCount === 1 ? 'item' : 'items';
  summaryText.innerHTML = `<span class="strong">${filterSelectedRecordIDs().length}</span> out of <span class="strong">${totalCount}</span> ${recordText} selected.`;
};

const temporaryList = () => {
  const list = getTemporaryList();
  const recordIds = Object.keys(list);
  const listCount = recordIds.length;
  const emptyList = document.querySelector('.list__empty');
  const listActions = document.querySelector('.list__actions');

  // Toggle empty message and actions panel
  if (listCount) {
    emptyList.style.display = 'none';
    listActions.removeAttribute('style');

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

    // Update Actions panel
    actionsPanelText();
    selectedText();

    // Watch for changes to the list and update accordingly
    listContainer.addEventListener('change', (event) => {
      if (event.target.matches(`${checkboxSelector}, .select-all > input[type="checkbox"]`)) {
        actionsPanelText();
        disableActionTabs();
        selectAllState();
        selectedText();
      }
    });
  } else {
    emptyList.removeAttribute('style');
    listActions.style.display = 'none';
  }
};

export { actionsPanelText, disableActionTabs, filterSelectedRecordIDs, getCheckboxes, selectedText, someCheckboxesChecked, temporaryList };
