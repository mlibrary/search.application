import { disableCopyCitationButton } from './_copy-citation.js';

const getCitationCSL = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const citationCSLChange = (toggleCopyCitationButton = disableCopyCitationButton) => {
  // `toggleCopyCitationButton` is passed in for testing purposes
  getCitationCSL().addEventListener('change', toggleCopyCitationButton());
};

export { citationCSLChange, getCitationCSL };
