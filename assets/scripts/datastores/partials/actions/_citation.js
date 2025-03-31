const copyCitation = () => {
  const citations = document.querySelector('.citation');
  const tabList = citations.querySelector('.citation__tablist');
  const copyCitationButton = citations.querySelector('.citation__copy');

  // Enable "Copy citation" button if a tab is already selected
  if (tabList.querySelector('[aria-selected="true"]')) {
    copyCitationButton.removeAttribute('disabled');
  }

  tabList.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }

    const isSelected = tab.getAttribute('aria-selected') === 'true';
    const currentTab = citations.querySelector(`#${tab.getAttribute('aria-controls')}`);
    const tabContent = currentTab.querySelector('.citation__input');

    if (isSelected && tabContent) {
      // Enable "Copy citation" button if a tab is selected
      copyCitationButton.removeAttribute('disabled');
      // Grab the citation content of the selected tab
      copyCitationButton.onclick = () => {
        navigator.clipboard.writeText(tabContent.textContent.trim());
        // Display alert
        const alert = currentTab.querySelector('.actions__alert');
        alert.style.display = 'block';
      };
    } else {
      // Disable "Copy citation" button if no tab is selected
      copyCitationButton.setAttribute('disabled', true);
      copyCitationButton.onclick = null;
    }
  });
};

export default copyCitation;
