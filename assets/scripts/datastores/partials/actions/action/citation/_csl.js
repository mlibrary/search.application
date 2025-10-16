import { disableCopyCitationButton } from './_copy-citation.js';
import { viewingTemporaryList } from '../../../../list/layout.js';

const getCitationCSL = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const generateCSLData = () => {
  return [];
};

const displayCSLData = () => {
  // Only run if viewing the temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  // Apply the data to the textarea
  getCitationCSL().textContent = JSON.stringify(generateCSLData());
};

const citationCSLChange = (toggleCopyCitationButton = disableCopyCitationButton) => {
  // `toggleCopyCitationButton` is passed in for testing purposes
  getCitationCSL().addEventListener('change', toggleCopyCitationButton());
};

export { citationCSLChange, displayCSLData, generateCSLData, getCitationCSL };
