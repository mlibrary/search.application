import { updateCheckboxLabel, updateCheckboxValue } from '../../../results/partials/results-list/list-item/header/_checkbox.js';
import { updateListItemTitle } from '../../../results/partials/results-list/list-item/header/_title.js';
import { updateMetadata } from '../../../partials/_metadata.js';

const partialClass = 'list__item--clone';

const cloneListItem = ({ listItem }) => {
  return listItem.cloneNode(true);
};

const updateListItemAttributes = ({ listItem, recordDatastore, recordId }) => {
  // Remove the template class
  listItem.classList.remove(partialClass);

  // Update the record datastore
  listItem.setAttribute('data-record-datastore', recordDatastore);
  // Update the record ID
  listItem.setAttribute('data-record-id', recordId);
};

const listItemUpdates = {
  cloneListItem,
  updateCheckboxLabel,
  updateCheckboxValue,
  updateListItemAttributes,
  updateListItemTitle,
  updateMetadata
};

const listItem = ({ datastore, index, record, recordId, updates = listItemUpdates }) => {
  // Clone the list item template
  const clonedListItem = updates.cloneListItem({ listItem: document.querySelector('.list__item--clone') });

  // Update the list item attributes
  updates.updateListItemAttributes({ listItem: clonedListItem, recordDatastore: datastore, recordId });

  // Update the checkbox
  const { metadata, title, url } = record;
  const checkbox = clonedListItem.querySelector('.record__checkbox');
  updates.updateCheckboxLabel({ checkbox, title: title.original });
  updates.updateCheckboxValue({ checkbox, recordDatastore: datastore, recordId });

  // Update the title
  updates.updateListItemTitle({ index, listItem: clonedListItem, title, url });

  // Update the metadata
  updates.updateMetadata({ listItem: clonedListItem, metadata });

  // Return the new list item
  return clonedListItem;
};

export {
  cloneListItem,
  listItem,
  updateListItemAttributes
};
