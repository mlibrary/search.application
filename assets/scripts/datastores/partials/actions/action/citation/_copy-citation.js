import { getCitationAlert, getCitationInput } from './_tabpanel.js';
import { copyToClipboard } from '../../../_actions.js';
import { getActiveCitationTab } from './_tablist.js';
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

const copyCitation = () => {
  getCopyCitationButton().addEventListener('click', () => {
    return copyToClipboard({
      alert: getCitationAlert(),
      text: getCitationInput().textContent.trim()
    });
  });
};

export { copyCitation, disableCopyCitationButton, getCopyCitationButton };
