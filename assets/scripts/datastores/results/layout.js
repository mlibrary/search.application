import { selectAllCheckboxState, updateSelectedCount } from '../partials/_select-all.js';
import { actionsPanelText } from '../partials/actions/_summary.js';
import { disableActionTabs } from '../partials/_actions.js';

const handleSelectionChange = ({
  actionsPanel = actionsPanelText,
  disableTabs = disableActionTabs,
  selectAllCheckbox = selectAllCheckboxState,
  updateCount = updateSelectedCount
} = {}) => {
  // Watch for changes to the list and update accordingly
  document.querySelector('.results__content').addEventListener('change', (event) => {
    if (event.target.matches(`input[type="checkbox"].record__checkbox, input[type="checkbox"].select-all__checkbox`)) {
      actionsPanel();
      selectAllCheckbox();
      updateCount();
      disableTabs();
    }
  });
};

const resultsList = ({
  actionsPanel = actionsPanelText,
  disableTabs = disableActionTabs,
  handleChange = handleSelectionChange
} = {}) => {
  actionsPanel();
  disableTabs();
  // Watch for changes to the list and update accordingly
  handleChange();
};

export { handleSelectionChange, resultsList };
