import { handleActionsPanelChange, initializeActions } from '../partials/_actions.js';
import { getCheckboxes } from './partials/results-list/list-item/header/_checkbox.js';
import { selectAll } from '../partials/_select-all.js';
import { temporaryListBanner } from '../list/partials/_go-to.js';

const toggleFiltersDetails = ({ details = document.querySelector('.results__sidebar--filters') } = {}) => {
  if (!details) {
    return;
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 980 && !details.hasAttribute('open')) {
      details.setAttribute('open', '');
    }
  });
};

const resultsList = ({
  actionsPanel = initializeActions,
  checkboxCount = getCheckboxes().length,
  handleActionsChange = handleActionsPanelChange,
  initializeSelectAll = selectAll,
  list,
  showBanner = temporaryListBanner,
  toggleFiltersDropdown = toggleFiltersDetails
} = {}) => {
  // Toggle filters dropdown on mobile
  toggleFiltersDropdown();

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

export { resultsList, toggleFiltersDetails };
