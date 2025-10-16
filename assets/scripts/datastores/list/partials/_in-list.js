import { getCheckboxes, getCheckedCheckboxes } from './list-item/_checkbox.js';
import { viewingTemporaryList } from '../layout.js';

const getInList = () => {
  return document.querySelector('.list__in-list');
};

const changeCount = (count) => {
  // Get the count element
  const countElement = getInList().querySelector('span.strong');

  // Apply the count to the element or set it to 0 if the count is not a number
  countElement.textContent = Number.isFinite(count) ? count : 0;
};

const selectedText = () => {
  // Only run if viewing temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  const totalCount = getCheckboxes().length;
  getInList().innerHTML = `<span class="strong">${getCheckedCheckboxes().length}</span> out of <span class="strong">${totalCount}</span> ${totalCount === 1 ? 'item' : 'items'} selected.`;
};

export { changeCount, getInList, selectedText };
