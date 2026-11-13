import { updateListItemCheckbox } from './header/_checkbox.js';
import { updateListItemTitle } from './header/_title.js';

const updateListItemHeader = ({
  hasExternalUrl,
  index,
  listItem,
  recordDatastore,
  recordId,
  title,
  updateCheckbox = updateListItemCheckbox,
  updateTitle = updateListItemTitle,
  url
}) => {
  // Update the checkbox
  updateCheckbox({ listItem, recordDatastore, recordId, title: title.text ?? title.original.text });

  // Update the title
  updateTitle({ hasExternalUrl, index, listItem, title, url });
};

export {
  updateListItemHeader
};
