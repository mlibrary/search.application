import { copyToClipboard } from '../../../_actions.js';
import { getActiveCitationTab } from './_tablist.js';
import { getActiveCitationTabpanel } from './_tabpanel.js';
import { getCSLTextarea } from './_csl.js';

const getCopyCitationButton = () => {
  return document.querySelector('.citation .citation__copy');
};

const disableCopyCitationButton = () => {
  const citationCSL = getCSLTextarea()?.value?.trim();
  // Check if CSL data exists and there is an active tab
  const hasEntry = citationCSL && citationCSL !== '[]' && getActiveCitationTab();
  getCopyCitationButton().toggleAttribute('disabled', !hasEntry);
};

const copyCitationObject = (activeCitationTabpanel = getActiveCitationTabpanel) => {
  // Pass in `activeCitationTabpanel` for testing
  const [alert, citation] = activeCitationTabpanel().querySelectorAll('.actions__alert, .citation__input');

  return { alert, text: citation.textContent.trim() };
};

const handleCopyCitation = (copyAction = copyToClipboard, citationObject = copyCitationObject) => {
  return copyAction(citationObject());
};

const copyCitationAction = (copyCitationButton = getCopyCitationButton, handleCopy = handleCopyCitation) => {
  copyCitationButton().addEventListener('click', () => {
    return handleCopy();
  });
};

const copyCitation = (copyAction = copyCitationAction) => {
  copyAction();
};

export {
  copyCitation,
  copyCitationAction,
  copyCitationObject,
  disableCopyCitationButton,
  getCopyCitationButton,
  handleCopyCitation
};
