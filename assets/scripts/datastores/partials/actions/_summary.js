import { getCheckedCheckboxes } from '../../results/partials/results-list/list-item/header/_checkbox.js';

const actionsPanelText = ({ count = getCheckedCheckboxes().length } = {}) => {
  const summaryText = document.querySelector('.actions__summary--header > small');
  const recordText = count === 1 ? 'record' : 'records';
  summaryText.textContent = count ? `Choose what to do with the selected ${recordText}.` : 'Select at least one record.';
};

export { actionsPanelText };
