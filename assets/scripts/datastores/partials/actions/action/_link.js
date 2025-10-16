import { copyToClipboard } from '../../_actions.js';

const copyLink = () => {
  const link = document.querySelector('#actions__link--tabpanel');
  const urlInput = link.querySelector('#action__link--input');
  const copyLinkButton = link.querySelector('button[type="submit"]');
  const alert = link.querySelector('.actions__alert');

  copyLinkButton.removeAttribute('disabled');
  copyLinkButton.addEventListener('click', (event) => {
    event.preventDefault();
    return copyToClipboard({ alert, text: urlInput.value });
  });
};

export default copyLink;
