const copyToClipboard = ({ alert, text }) => {
  // Show the alert if it exists
  if (alert) {
    alert.style.display = 'block';
  }

  // Copy the text to the clipboard
  return navigator.clipboard.writeText(text);
};

const copyLink = ({ copy = copyToClipboard }) => {
  const link = document.querySelector('#actions__link--tabpanel');
  const urlInput = link.querySelector('#action__link--input');
  const copyLinkButton = link.querySelector('button[type="submit"]');
  const alert = link.querySelector('.alert');

  // Enable the copy link button
  copyLinkButton.removeAttribute('disabled');

  // Attach the click event listener to the copy link button
  copyLinkButton.addEventListener('click', (event) => {
    event.preventDefault();
    return copy({ alert, text: urlInput.value });
  });
};

export { copyLink, copyToClipboard };
