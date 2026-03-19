import { checkboxSelector, getCheckboxes } from './partials/results-list/list-item/header/_checkbox.js';
import { disableActionTabs, initializeActions } from '../partials/_actions.js';
import { selectAll, selectAllCheckboxState, updateSelectedCount } from '../partials/_select-all.js';
import { actionsPanelText } from '../partials/actions/_summary.js';
import { regenerateCitations } from '../partials/actions/action/_citation.js';
import { temporaryListBanner } from '../list/partials/_go-to.js';
import { updateCSLData } from '../partials/actions/action/citation/_csl.js';
import { updateToggleSelectedAction } from '../partials/actions/action/_toggle-selected.js';

const handleSelectionChange = ({
  actionsText = actionsPanelText,
  disableTabs = disableActionTabs,
  selectAllCheckbox = selectAllCheckboxState,
  updateCitations = regenerateCitations,
  updateCount = updateSelectedCount,
  updateCSL = updateCSLData,
  updateToggleSelected = updateToggleSelectedAction
} = {}) => {
  // Watch for changes to the list and update accordingly
  document.querySelector('.results__content').addEventListener('change', (event) => {
    if (event.target.matches(`${checkboxSelector}, input[type="checkbox"].select-all__checkbox`)) {
      // Update the toggle selected action based on the current state of the checkboxes
      updateToggleSelected();

      // Update the Actions panel text depending on how many records are selected
      actionsText();

      // Disable action tabs if no records are selected
      disableTabs();

      // Update CSL data
      updateCSL();

      // Regenerate citations
      updateCitations();

      // Update the state of the `Select All` checkbox
      selectAllCheckbox();

      // Update the count of selected records for the `Select All` partial
      updateCount();
    }
  });
};

const resultsList = ({
  actionsPanel = initializeActions,
  actionsText = actionsPanelText,
  checkboxCount = getCheckboxes().length,
  disableTabs = disableActionTabs,
  handleChange = handleSelectionChange,
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

  // Update the Actions panel text depending on how many records are selected
  actionsText();

  // Disable action tabs until at least one record is selected
  disableTabs();

  // Select all
  initializeSelectAll();

  // Watch for changes to the list and update accordingly
  handleChange({ list });
};

export { handleSelectionChange, resultsList };
