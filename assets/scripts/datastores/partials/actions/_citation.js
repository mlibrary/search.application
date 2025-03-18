const copyCitation = () => {
  const tabList = document.querySelector('.citation__tablist');
  const copyCitationButton = document.querySelector('.citation .citation__copy');

  tabList.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }

    const isSelected = tab.getAttribute('aria-selected') === 'true';
    const tabContent = document.querySelector(`#${tab.getAttribute('aria-controls')} .citation__input`);

    if (isSelected && tabContent) {
      // Enable "Copy citation" button if a tab is selected
      copyCitationButton.removeAttribute('disabled');
      // Grab the citation content of the selected tab
      copyCitationButton.onclick = () => {
        navigator.clipboard.writeText(tabContent.textContent.trim());
      };
    } else {
      // Disable "Copy citation" button if no tab is selected
      copyCitationButton.setAttribute('disabled', true);
      copyCitationButton.onclick = null;
    }
  });
};

export default copyCitation;
