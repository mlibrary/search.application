// Hide first three list items
const hideListItems = (listItems) => {
  listItems.forEach((item, index) => {
    if (index > 2) {
      item.style.display = 'none';
    }
  });
};

const toggleMetadata = () => {
  // Get all toggle buttons for metadata
  const buttons = document.querySelectorAll('button.metadata__toggle');

  buttons.forEach((button) => {
    const list = document.getElementById(button.getAttribute('aria-controls'));
    const listItems = list.querySelectorAll(':scope > li');

    // Hide the button if there are three or fewer list items
    if (listItems.length <= 3) {
      button.style.display = 'none';
      return;
    }

    // Store the original text for toggling
    const textHideItems = button.textContent;
    const textShowItems = button.textContent.replace('fewer', `all ${listItems.length}`);

    // Hide all list items except the first three
    hideListItems(listItems);
    button.textContent = textShowItems;
    button.setAttribute('aria-expanded', 'false');

    // Apply toggle logic
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.textContent = isExpanded ? textShowItems : textHideItems;
      if (isExpanded) {
        hideListItems(listItems);
      } else {
        listItems.forEach((item) => {
          item.removeAttribute('style');
        });
      }
    });
  });
};

export default toggleMetadata;
