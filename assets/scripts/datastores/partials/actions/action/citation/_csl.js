import { selectedCitations } from '../../../../list/partials/list-item/_checkbox.js';
import { viewingTemporaryList } from '../../../../list/layout.js';

const getCSLTextarea = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const displayCSLData = () => {
  // Only run if viewing the temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  // Apply the data to the textarea
  getCSLTextarea().textContent = JSON.stringify(selectedCitations('csl'));
};

const cslData = () => {
  return JSON.parse(getCSLTextarea().textContent);
};

export { cslData, displayCSLData, getCSLTextarea };
