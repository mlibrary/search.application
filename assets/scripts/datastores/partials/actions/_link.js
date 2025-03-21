const copyLink = () => {
  const link = document.querySelector('.actions__form.link');
  const urlInput = link.querySelector('#action__link--input');
  const copyLinkButton = link.querySelector('.link .link__copy');

  copyLinkButton.removeAttribute('disabled');
  copyLinkButton.addEventListener('click', (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(urlInput.value);
  });
};

export default copyLink;
