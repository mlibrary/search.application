import { disableCopyCitationButton } from './_copy-citation.js';

const tablistSelector = '.citation .citation__tablist[role="tablist"]';

const getActiveCitationTab = () => {
  return document.querySelector(`${tablistSelector} [role="tab"][aria-selected="true"]`);
};

const citationTabClick = (toggleCopyCitationButton = disableCopyCitationButton) => {
  document.querySelector(tablistSelector).addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }
    // `toggleCopyCitationButton` is passed in for testing purposes
    toggleCopyCitationButton();
  });
};

export { citationTabClick, getActiveCitationTab };
