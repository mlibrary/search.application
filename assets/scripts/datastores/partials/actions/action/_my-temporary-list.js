/*
  - Check if in full record view
    - If so, grab `data-record-id` and `data-record-datastore` from `.record__container` element
    - Check if item is already in temporary list
      - If so, change button text to "Remove item from list"

  ^^ [X] Create function to check if in full record view
  ^^ [] Create function to check if item is in temporary list

  - If not in full record view
    - Grab all selected items from datastore results
    - For each selected item, grab `data-record-id` and `data-record-datastore`
    - Check if all items are already in temporary list
      - If so, change button text to "Remove selected items from list"
  ^^ [] Create function to grab selected items from results
  ^^ [] Create function to check if all items are in temporary list

  - On button click
    - If in full record view
      - If item is already in temporary list
        - Remove item from temporary list
        - Change button text to "Add item to list"
      - If item is not in temporary list
        - Add item to temporary list
        - Change button text to "Remove item from list"
    - If not in full record view
      - For each selected item
        - If item is already in temporary list
          - Remove item from temporary list
        - If item is not in temporary list
          - Add item to temporary list
      - If all items were already in temporary list
        - Change button text to "Add selected items to list"
      - If any items were not in temporary list
        - Change button text to "Remove selected items from list"
  ^^ [] Create function to handle button click event
*/

/*
  Scan all elements that contain `data-record-id` and `data-record-datastore` attributes, and toggle class
*/

import { viewingFullRecord } from '../../../record/layout.js';

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
  // Get session storage
  const item = sessionStorage.getItem(listName);

  // Return the default list if `item` is falsy, or returned problematic string values
  if (!item || item === 'undefined' || item === 'null') {
    return defaultTemporaryList;
  }

  // If failing to parse, return the default list
  try {
    return JSON.parse(item);
  } catch {
    return defaultTemporaryList;
  }
};

const setTemporaryList = (list) => {
  sessionStorage.setItem(listName, JSON.stringify(list));
};

const inTemporaryList = ({ list, recordDatastore, recordId }) => {
  // Check that the datastore exists in the list, and the record ID exists within the datastore
  return Boolean(list?.[recordDatastore]?.[recordId]);
};

const removeRecordFromList = ({ list, recordDatastore, recordId }) => {
  const updatedList = { ...list };
  if (updatedList[recordDatastore] && updatedList[recordDatastore][recordId]) {
    delete updatedList[recordDatastore][recordId];
  }
  return updatedList;
};

const fetchAndAddRecord = async ({ list, recordDatastore, recordId, url }) => {
  const updatedList = { ...list };

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Return the original list if the fetch fails
      return updatedList;
    }
    // Add the record information to the list
    const data = await response.json();
    updatedList[recordDatastore][recordId] = data;
  } catch {
    // Silent failure, so no action is needed
    return updatedList;
  }

  return updatedList;
};

const toggleTabUI = ({ button, isAdded, isFullRecordView = viewingFullRecord }) => {
  // Update the button class
  button.classList.toggle('actions__my-temporary-list--remove', isAdded);
  // Update the button text
  const type = isFullRecordView ? 'item' : 'selected';
  button.textContent = isAdded ? `Remove ${type} from list` : `Add ${type} to list`;
};

const toggleTabpanelButtonUI = ({ button, isAdded }) => {
  // Update the button text
  button.textContent = `${isAdded ? 'Remove from' : 'Add to'} My Temporary List`;
};

const allRecordsInList = ({ list, records }) => {
  return records.length === list.length;
};

const toggleUI

const toggleTemporaryListItem = ({ list }) => {
  // eslint-disable-next-line no-console
  console.log('Toggling temporary list item with list:', list);
};

export {
  defaultTemporaryList,
  fetchAndAddRecord,
  getTemporaryList,
  inTemporaryList,
  removeRecordFromList,
  setTemporaryList,
  toggleTabpanelButtonUI,
  toggleTabUI,
  toggleTemporaryListItem
};
