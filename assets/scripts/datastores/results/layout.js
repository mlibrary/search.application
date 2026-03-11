import { selectAllCheckboxState, updateSelectedCount } from '../partials/_select-all.js';
import { actionsPanelText } from '../partials/actions/_summary.js';
import { disableActionTabs } from '../partials/_actions.js';
import { updateToggleSelectedAction } from '../partials/actions/action/_toggle-selected.js';

const handleSelectionChange = ({
  actionsPanel = actionsPanelText,
  disableTabs = disableActionTabs,
  list,
  selectAllCheckbox = selectAllCheckboxState,
  updateCount = updateSelectedCount,
  updateToggleSelected = updateToggleSelectedAction
} = {}) => {
  // Watch for changes to the list and update accordingly
  document.querySelector('.results__content').addEventListener('change', (event) => {
    if (event.target.matches(`input[type="checkbox"].record__checkbox, input[type="checkbox"].select-all__checkbox`)) {
      actionsPanel();
      selectAllCheckbox();
      updateCount();
      disableTabs();
      updateToggleSelected({ list });
    }
  });
};

const resultsList = ({
  actionsPanel = actionsPanelText,
  disableTabs = disableActionTabs,
  handleChange = handleSelectionChange,
  list
} = {}) => {
  actionsPanel();
  disableTabs();
  // Watch for changes to the list and update accordingly
  handleChange({ list });
};

export { handleSelectionChange, resultsList };
