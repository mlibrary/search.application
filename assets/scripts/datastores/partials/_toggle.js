const attribute = 'data-toggle';

const getToggleButtons = () => {
  return document.querySelectorAll(`button[${attribute}]`);
};

// Hide all items beyond the count
const toggleDisplayedItems = ({ count, isExpanded, items }) => {
  items.forEach((item, index) => {
    if (index > (count - 1)) {
      if (isExpanded) {
        item.removeAttribute('style');
      } else {
        item.style.display = 'none';
      }
    }
  });
};

const toggleItems = ({ buttons = getToggleButtons(), displayItems = toggleDisplayedItems } = {}) => {
  buttons.forEach((button) => {
    // Convert to a number, or default to 5 if NaN
    const count = Number(button.getAttribute(attribute)) || 5;
    // Get the element that will be toggled, along with the items
    const control = document.getElementById(button.getAttribute('aria-controls'));
    // Get all direct child elements of the control
    const items = control.querySelectorAll(':scope > *');

    // Hide the button if there are not enough items
    if (items.length <= count) {
      button.style.display = 'none';
      return;
    }

    // Store the original text for toggling
    const textHideItems = button.textContent || 'Show fewer';
    const textShowItems = button.textContent.replace('fewer', `all ${items.length}`);

    // Hide all items except the first count
    displayItems({ count, isExpanded: false, items });
    button.textContent = textShowItems;
    button.setAttribute('aria-expanded', 'false');

    // Apply toggle logic
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.textContent = isExpanded ? textShowItems : textHideItems;
      displayItems({ count, isExpanded: !isExpanded, items });
    });
  });
};

export {
  getToggleButtons,
  toggleDisplayedItems,
  toggleItems
};
