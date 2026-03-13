import { cloneListItem, getListItemPartial, updateListItem } from './results-list/_list-item.js';
import { getDatastores } from '../../list/layout.js';
import { toggleAddedClass } from '../../partials/actions/action/toggle-selected/_add.js';

const getResultsList = ({ recordDatastore }) => {
  return document.querySelector(`.list__${recordDatastore} .results__list`);
};

const createRecordItem = ({
  cloneItem = cloneListItem,
  index,
  originalListItem,
  record,
  recordDatastore,
  recordId,
  resultsList,
  toggleClass = toggleAddedClass,
  updateItem = updateListItem
}) => {
  // Clone the list item
  const listItem = cloneItem({ listItem: originalListItem });
  // Update the cloned list item
  updateItem({ index, listItem, record, recordDatastore, recordId });
  // Append the cloned list item to the results list
  resultsList.appendChild(listItem);
  // Update class
  toggleClass({ isAdded: true, recordDatastore, recordId });
};

const createRecordItems = ({
  createRecord = createRecordItem,
  datastoreList,
  originalListItem,
  recordDatastore,
  resultsList
}) => {
  // Loop through all the records in the datastore
  Object.keys(datastoreList).forEach((recordId, index) => {
    // Create a record item
    createRecord({
      index,
      originalListItem,
      record: datastoreList[recordId],
      recordDatastore,
      recordId,
      resultsList
    });
  });
};

const updateResultsList = ({
  createRecords = createRecordItems,
  datastoreList,
  getDatastoreList = getResultsList,
  getListItem = getListItemPartial,
  recordDatastore
}) => {
  // Find the results list for the current datastore
  const resultsList = getDatastoreList({ recordDatastore });

  // Return if no results list is found
  if (!resultsList) {
    return;
  }

  // Get the original list item
  const originalListItem = getListItem({ resultsList });

  // Create record items based off of the original list item
  createRecords({ datastoreList, originalListItem, recordDatastore, resultsList });

  // Remove the original list item
  originalListItem.remove();
};

const updateResultsLists = ({
  datastores = getDatastores,
  list,
  updateList = updateResultsList
}) => {
  // Loop through the non-empty datastores
  datastores({ list }).forEach((recordDatastore) => {
    // Update the list
    updateList({ datastoreList: list[recordDatastore], recordDatastore });
  });
};

export {
  createRecordItem,
  createRecordItems,
  getResultsList,
  updateResultsList,
  updateResultsLists
};
