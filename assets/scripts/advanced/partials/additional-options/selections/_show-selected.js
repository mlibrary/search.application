const getShowSelectedButton = ({ selections }) => {
  return selections.querySelector('.additional-option__selections--show-selected');
};

const updateShowSelectedButtonCount = ({ button, count }) => {
  const countElement = button.querySelector('.additional-option__selections--show-selected-count');
  countElement.textContent = count;
};

const toggleShowSelectedButton = ({ button, count }) => {
  // Toggle the visibility of the button, if the count is greater than 0
  if (count > 0) {
    button.removeAttribute('style');
  } else {
    button.setAttribute('style', 'display: none;');
  }
};

const handleShowSelectedFilters = ({ button, selections, toggleUncheckedCheckboxes }) => {
  // Add functionality to handle showing selected filters
  button.addEventListener('click', () => {
    toggleUncheckedCheckboxes({ selections });
  });
};

const showSelectedFilters = ({ checkedCheckboxes, handleShowSelected = handleShowSelectedFilters, selections, showSelectedButton = getShowSelectedButton, toggleButton = toggleShowSelectedButton }) => {
  const button = showSelectedButton({ selections });

  // Toggle the visibility of the show selected button on load
  toggleButton({ button, count: checkedCheckboxes.length });

  // Handle show selected filters
  handleShowSelected({ button, selections });
};

export {
  getShowSelectedButton,
  handleShowSelectedFilters,
  showSelectedFilters,
  toggleShowSelectedButton,
  updateShowSelectedButtonCount
};
