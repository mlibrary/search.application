import { disableCopyCitationButton } from './_copy-citation.js';

const getCitationTablist = () => {
  return document.querySelector('.citation .citation__tablist[role="tablist"]');
};

const getActiveCitationTab = () => {
  return getCitationTablist().querySelector('[role="tab"][aria-selected="true"]');
};

const triggerCitationTabChange = (toggleCopyCitationButton = disableCopyCitationButton) => {
  getCitationTablist().addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }
    // `toggleCopyCitationButton` is passed in for testing purposes
    toggleCopyCitationButton();
  });
};

export { getActiveCitationTab, getCitationTablist, triggerCitationTabChange };
