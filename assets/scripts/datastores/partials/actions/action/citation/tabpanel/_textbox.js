import { getCopyCitationButton } from '../_copy-citation.js';

const attachTheCitations = (tabPanel, getBibEntries = [], copyCitationButton = getCopyCitationButton) => {
  const textbox = document.querySelector(`#${tabPanel} [role='textbox']`);
  const hasEntries = getBibEntries.length > 0;

  // Update the textbox with citation entries or not available message
  textbox.innerHTML = hasEntries ? getBibEntries.join('') : '<span class="citation__not-available">Citation not available.</span>';

  // Enable or disable the copy button based on whether there are entries
  copyCitationButton().toggleAttribute('disabled', !hasEntries);
};

export { attachTheCitations };
