import { getSelectionsCheckboxesByState, toggleSelectionsUncheckedCheckboxes } from './_checkboxes.js';

const getShowSelectedButton = ({ selections }) => {
  return selections.querySelector('.additional-option__selections--show-selected');
};

const updateShowSelectedButtonCount = ({ button, count }) => {
  const countElement = button.querySelector('.additional-option__selections--show-selected-count');
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

const toggleShowSelectedButtonVisibility = ({ button, getCheckedCheckboxes = getSelectionsCheckboxesByState, selections }) => {
  // Toggle the visibility of the button, if the count is greater than 0
  const checkedCheckboxes = getCheckedCheckboxes({ checked: true, selections });
  if (checkedCheckboxes.length > 0) {
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
    toggleUncheckedCheckboxes({ selections });
  });
};

const initializeShowSelected = ({
  handleShowSelected = handleShowSelectedFilters,
  selections,
  showSelectedButton = getShowSelectedButton,
  toggleButtonVisibility = toggleShowSelectedButtonVisibility
}) => {
  // Get the show selected button
  const button = showSelectedButton({ selections });

  // Save the arguments
  const args = { button, selections };

  // Toggle the visibility of the show selected button on load
  toggleButtonVisibility(args);

  // Handle show selected filters
  handleShowSelected(args);
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
