const attribute = 'data-truncate';

const getTruncateTextButtons = () => {
  return document.querySelectorAll(`button[${attribute}]`);
};

const getTruncateButtonInformation = ({ button, defaultCount = 300 } = {}) => {
  // Get the element's full text content
  const text = document.getElementById(button.getAttribute('aria-controls')).textContent.trim();
  // Get the number of characters to display. Convert to a number, or use default count if NaN.
  const count = Number(button.getAttribute(attribute)) || defaultCount;
  return { count, text };
};

const getTruncatedTextInformation = ({ button, getButtonInformation = getTruncateButtonInformation, trimCount = 60 } = {}) => {
  const { count, text } = getButtonInformation({ button });
  const textOptions = {
    full: text,
    truncated: null
  };

  // Calculate the number of characters to show before truncation
  const characterTrim = count - trimCount;

  // Check if the count is greater than the trim count and if the full text length exceeds the character trim length
  if (count > trimCount && text.length > characterTrim) {
    // Truncate the text and add ellipses
    textOptions.truncated = `${text.substring(0, characterTrim)}...`;
  }

  // Return the text options
  return textOptions;
};

const toggleTruncateButton = ({ button, isExpanded } = {}) => {
  // Update the button text
  button.textContent = `Show ${isExpanded ? 'less' : 'more'}`;
  // Update the `aria-expanded` attribute
  button.setAttribute('aria-expanded', String(isExpanded));
};

const toggleTruncatedElements = ({
  button,
  full,
  toggleButton = toggleTruncateButton,
  truncated
} = {}) => {
  const element = document.getElementById(button.getAttribute('aria-controls'));
  // Get the opposite of the button's expanded state
  const currentState = button.getAttribute('aria-expanded') === 'true';
  // Toggle the element's text content between full and truncated based on the button's expanded state
  element.textContent = currentState ? truncated : full;
  // Toggle the button text and aria-expanded attribute based on the opposite of the button's expanded state
  toggleButton({ button, isExpanded: !currentState });
};

const handleTruncatedElements = ({ button, full, toggleElements = toggleTruncatedElements, truncated } = {}) => {
  // Toggle the button text and aria-expanded attribute based on the opposite of the button's expanded state
  toggleElements({ button, full, truncated });
  // Add a click event listener to the button
  button.addEventListener('click', () => {
    // Toggle the button text and aria-expanded attribute based on the opposite of the button's expanded state
    toggleElements({ button, full, truncated });
  });
};

const truncateText = ({
  buttons = getTruncateTextButtons(),
  getTextInformation = getTruncatedTextInformation,
  handleElements = handleTruncatedElements
} = {}) => {
  // Loop through all the buttons
  buttons.forEach((button) => {
    const { full, truncated } = getTextInformation({ button });

    // Check if truncated text exists
    if (truncated) {
      // Handle the truncated elements
      handleElements({ button, full, truncated });
    } else {
      // Hide the button
      button.style.display = 'none';
    }
  });
};

export {
  getTruncateButtonInformation,
  getTruncatedTextInformation,
  getTruncateTextButtons,
  handleTruncatedElements,
  toggleTruncateButton,
  toggleTruncatedElements,
  truncateText
};
