import { toggleSelectionsUncheckedCheckboxes } from './_checkboxes.js';

const getShowSelectedButton = ({ selections }) => {
  return selections.querySelector('.additional-option__selections--show-selected');
};

const updateShowSelectedButtonCount = ({ button, count }) => {
  // Get the count element within the button
  const countElement = button.querySelector('.additional-option__selections--show-selected-count');
  // Update the count
  countElement.textContent = count;
};

const isShowSelectedButtonPressed = ({ button }) => {
  return button.getAttribute('aria-pressed') === 'true';
};

const toggleShowSelectedButtonPressed = ({ button, isPressed = isShowSelectedButtonPressed({ button }) }) => {
  // Set `aria-pressed` to the opposite of the current pressed state
  button.setAttribute('aria-pressed', String(!isPressed));
};

const toggleShowSelectedButtonClass = ({ button, isPressed = isShowSelectedButtonPressed({ button }) }) => {
  button.classList.toggle('button__ghost--active', !isPressed);
};

const toggleShowSelectedButtonText = ({ button, isPressed = isShowSelectedButtonPressed({ button }) }) => {
  const notPressedText = button.querySelector('.additional-option__selections--show-selected-not-pressed');
  const pressedText = button.querySelector('.additional-option__selections--show-selected-pressed');
  if (isPressed) {
    notPressedText.setAttribute('style', 'display: none;');
    pressedText.removeAttribute('style');
  } else {
    notPressedText.removeAttribute('style');
    pressedText.setAttribute('style', 'display: none;');
  }
};

const toggleShowSelectedButtonItems = ({
  button,
  toggleClass = toggleShowSelectedButtonClass,
  togglePressed = toggleShowSelectedButtonPressed,
  toggleText = toggleShowSelectedButtonText
}) => {
  // Toggle the button's active class
  toggleClass({ button });
  // Toggle the pressed state of the button
  togglePressed({ button });
  // Toggle the text of the button
  toggleText({ button });
};

const toggleShowSelectedButtonVisibility = ({ button, count }) => {
  // Toggle the visibility of the button, if the count is greater than 0
  if (count > 0) {
    button.removeAttribute('style');
  } else {
    button.setAttribute('style', 'display: none;');
  }
};

const handleShowSelectedFilters = ({
  button,
  selections,
  toggleButtonItems = toggleShowSelectedButtonItems,
  toggleUncheckedCheckboxes = toggleSelectionsUncheckedCheckboxes
}) => {
  // Add functionality to handle showing selected filters
  button.addEventListener('click', () => {
    toggleButtonItems({ button });
    toggleUncheckedCheckboxes({ button, selections });
  });
};

const initializeShowSelected = ({
  button,
  handleShowSelected = handleShowSelectedFilters,
  selections,
  toggleButtonVisibility = toggleShowSelectedButtonVisibility
}) => {
  // Toggle the visibility of the show selected button on load
  toggleButtonVisibility({ button, selections });

  // Handle show selected filters
  handleShowSelected({ button, selections });
};

export {
  getShowSelectedButton,
  handleShowSelectedFilters,
  initializeShowSelected,
  isShowSelectedButtonPressed,
  toggleShowSelectedButtonClass,
  toggleShowSelectedButtonItems,
  toggleShowSelectedButtonPressed,
  toggleShowSelectedButtonText,
  toggleShowSelectedButtonVisibility,
  updateShowSelectedButtonCount
};
