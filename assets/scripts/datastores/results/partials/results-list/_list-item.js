import { updateCheckbox } from '../../../results/partials/results-list/list-item/header/_checkbox.js';
import { updateListItemTitle } from '../../../results/partials/results-list/list-item/header/_title.js';
import { updateMetadata } from '../../../partials/_metadata.js';

const getListItemPartial = ({ resultsList }) => {
  return resultsList.querySelector(`li.results__list-item`);
};

const cloneListItem = ({ listItem }) => {
  return listItem.cloneNode(true);
};

const updateListItemAttributes = ({ listItem, recordDatastore, recordId }) => {
  // Update the record datastore
  listItem.setAttribute('data-record-datastore', recordDatastore);
  // Update the record ID
  listItem.setAttribute('data-record-id', recordId);
};

const listItemFunctions = {
  cloneListItem,
  updateCheckbox,
  updateListItemAttributes,
  updateListItemTitle,
  updateMetadata
};

const updateListItem = ({ index, listItem, listItemFuncs = listItemFunctions, record, recordDatastore, recordId }) => {
  // Update the list item attributes
  listItemFuncs.updateListItemAttributes({ listItem, recordDatastore, recordId });

  // Break down the record information
  const { metadata, title, url } = record;

  // Update the checkbox
  listItemFuncs.updateCheckbox({ listItem, recordDatastore, recordId, title: title.original });

  // Update the title
  listItemFuncs.updateListItemTitle({ index, listItem, title, url });

  // Update the metadata
  listItemFuncs.updateMetadata({ listItem, metadata });
};

export {
  cloneListItem,
  getListItemPartial,
  updateListItem,
  updateListItemAttributes
};
