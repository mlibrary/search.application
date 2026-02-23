const attribute = 'data-toggle';

const getToggleButtons = () => {
  return document.querySelectorAll(`button[${attribute}]`);
};

const getToggleButtonInformation = ({ button }) => {
  // Get the element that will be toggled
  const control = document.getElementById(button.getAttribute('aria-controls'));
  // Get the number of items to display. Convert to a number, or default to 5 if NaN.
  const count = Number(button.getAttribute(attribute)) || 5;
  // Get all direct child elements of the control
  const items = control.querySelectorAll(':scope > *');
  return { count, items, length: items.length };
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

const setToggleButtonInformation = ({ button, length }) => {
  // Get the current expanded state
  const isExpanded = button.getAttribute('aria-expanded') === 'true';
  // Set the opposite expanded state
  button.setAttribute('aria-expanded', String(!isExpanded));
  // Replace the button text accordingly
  const textOptions = {
    false: 'Show fewer',
    true: `Show all ${length}`
  };
  button.textContent = button.textContent.replace(textOptions[!isExpanded], textOptions[isExpanded]);
};

const toggleItems = ({ buttonInformation = getToggleButtonInformation, buttons = getToggleButtons(), displayItems = toggleDisplayedItems, setButtonInformation = setToggleButtonInformation } = {}) => {
  buttons.forEach((button) => {
    const { count, items, length } = buttonInformation({ button });

    // Hide the button if there are not enough items
    if (length <= count) {
      button.style.display = 'none';
      return;
    }

    // Hide all items beyond the count
    displayItems({ count, isExpanded: false, items });
    // Set initial button information
    setButtonInformation({ button, length });

    // Apply toggle logic
    button.addEventListener('click', () => {
      // Toggle the displayed items
      displayItems({ count, isExpanded: !(button.getAttribute('aria-expanded') === 'true'), items });
      // Update the button information
      setButtonInformation({ button, length });
    });
  });
};

export {
  getToggleButtonInformation,
  getToggleButtons,
  setToggleButtonInformation,
  toggleDisplayedItems,
  toggleItems
};
