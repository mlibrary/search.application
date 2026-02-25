import { getCheckedCheckboxes } from '../../results/partials/results-list/list-item/header/_checkbox.js';
import { viewingTemporaryList } from '../../list/layout.js';

const actionsPanelText = () => {
  // Only run if viewing temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  const summaryText = document.querySelector('.actions__summary--header > small');
  const selectedCount = getCheckedCheckboxes().length;
  const recordText = selectedCount === 1 ? 'record' : 'records';
  summaryText.textContent = selectedCount ? `Choose what to do with the selected ${recordText}.` : 'Select at least one record.';
};

export { actionsPanelText };
