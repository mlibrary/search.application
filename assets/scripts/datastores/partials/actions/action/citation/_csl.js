import { selectedCitations } from '../../../../list/partials/list-item/_checkbox.js';

const getCSLTextarea = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const displayCSLData = ({ list }) => {
  // Apply the data to the textarea
  getCSLTextarea().textContent = JSON.stringify(selectedCitations({ list, type: 'csl' }));
};

const cslData = () => {
  return JSON.parse(getCSLTextarea().textContent);
};

export { cslData, displayCSLData, getCSLTextarea };
