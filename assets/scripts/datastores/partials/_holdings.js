// Hide all items beyond the count
const hideItems = ({ count, items }) => {
  items.forEach((item, index) => {
    if (index > (count - 1)) {
      item.style.display = 'none';
    }
  });
};

const toggleItems = () => {
  // Get all toggle buttons
  const attribute = 'data-toggle';
  const buttons = document.querySelectorAll(`button[${attribute}]`);

  buttons.forEach((button) => {
    // Convert to a number
    const count = Number(button.getAttribute(attribute));
    // Get the element that will be toggled, along with the items
    const control = document.getElementById(button.getAttribute('aria-controls'));
    const items = control.querySelectorAll(':scope .toggle__item');

    /*
      Hide the button if:
      - the value `data-toggle` is not a number
      - there are not enough items
    */
    if (isNaN(count) || items.length <= count) {
      button.style.display = 'none';
      return;
    }

    // Store the original text for toggling
    const textHideItems = button.textContent || 'Show fewer';
    const textShowItems = button.textContent.replace('fewer', `all ${items.length}`);

    // Hide all items except the first count
    hideItems({ count, items });
    button.textContent = textShowItems;
    button.setAttribute('aria-expanded', 'false');

    // Apply toggle logic
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.textContent = isExpanded ? textShowItems : textHideItems;
      if (isExpanded) {
        hideItems({ count, items });
      } else {
        items.forEach((item) => {
          item.removeAttribute('style');
        });
      }
    });
  });
};

export default toggleItems;
