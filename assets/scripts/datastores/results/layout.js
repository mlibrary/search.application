import { handleActionsPanelChange, initializeActions } from '../partials/_actions.js';
import { getCheckboxes } from './partials/results-list/list-item/header/_checkbox.js';
import { selectAll } from '../partials/_select-all.js';
import { temporaryListBanner } from '../list/partials/_go-to.js';

const resultsList = ({
  actionsPanel = initializeActions,
  checkboxCount = getCheckboxes().length,
  handleActionsChange = handleActionsPanelChange,
  initializeSelectAll = selectAll,
  list,
  showBanner = temporaryListBanner
} = {}) => {
  // Return early if no checkboxes are found
  if (checkboxCount === 0) {
    return;
  }

  // Show My Temporary List banner
  showBanner({ list });

  // Actions panel
  actionsPanel({ list });

  // Select all
  initializeSelectAll();

  // Watch for changes to the list and update accordingly
  handleActionsChange({ element: document.querySelector('.results__content') });
};

export { resultsList };
