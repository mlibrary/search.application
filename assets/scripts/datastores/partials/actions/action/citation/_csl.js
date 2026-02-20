import { selectedCitations } from '../_citation.js';

const getCSLTextarea = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const displayCSLData = ({ getCitations = selectedCitations, list, textArea = getCSLTextarea }) => {
  // Apply the data to the textarea
  textArea().textContent = JSON.stringify(getCitations({ list, type: 'csl' }));
};

const cslData = ({ textArea = getCSLTextarea } = {}) => {
  return JSON.parse(textArea().textContent);
};

export { cslData, displayCSLData, getCSLTextarea };
