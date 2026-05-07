import {
  isShowSelectedButtonPressed,
  toggleShowSelectedButtonVisibility,
  updateShowSelectedButtonCount
} from './_show-selected.js';
import { checkSelectionsCheckboxValueByFilter } from './_filter.js';

const getSelectionsCheckboxes = ({ selections }) => {
  return selections.querySelectorAll('.additional-option__selections--checkbox');
};

const getSelectionsCheckboxesByState = ({ checkboxes = getSelectionsCheckboxes, checked = false, selections }) => {
  // Get all checkboxes within the selections container
  const allCheckboxes = checkboxes({ selections });
  // Return all unchecked checkboxes
  return Array.from(allCheckboxes).filter((checkbox) => {
    // Check if the checkbox is unchecked
    return checkbox.querySelector('input[type="checkbox"]').checked === checked;
  });
};

const getSelectionsVisibleCheckedCheckboxes = ({ getCheckedCheckboxes = getSelectionsCheckboxesByState, selections }) => {
  // Get all checked checkboxes within the selections container
  const checkedCheckboxes = getCheckedCheckboxes({ checked: true, selections });
  // Return all checkboxes that are currently visible and checked
  return Array.from(checkedCheckboxes).filter((checkbox) => {
    return checkbox.style.display !== 'none';
  });
};

const toggleSelectionsUncheckedCheckboxes = ({
  button,
  checkCheckboxValueByFilter = checkSelectionsCheckboxValueByFilter,
  buttonPressed = isShowSelectedButtonPressed,
  selections,
  uncheckedCheckboxes = getSelectionsCheckboxesByState({ checked: false, selections })
}) => {
  // Check if the button is pressed
  const isButtonPressed = buttonPressed({ button });
  // Loop through each checkbox
  uncheckedCheckboxes.forEach((checkbox) => {
    if (isButtonPressed) {
      // Hide the checkbox if the show selected button is pressed
      checkbox.setAttribute('style', 'display: none;');
    } else if (checkCheckboxValueByFilter({ checkbox, selections })) {
      // Show the checkbox if it matches the filter value
      checkbox.removeAttribute('style');
    }
  });
};

const filterSelectionsCheckboxes = ({
  button,
  filter,
  getCheckboxes = getSelectionsCheckboxes,
  getCheckedCheckboxes = getSelectionsCheckboxesByState,
  isButtonPressed = isShowSelectedButtonPressed,
  selections
}) => {
  // Get the pressed state of the show selected button
  const isPressed = isButtonPressed({ button });
  // Get the checkboxes within the selections container depending on the state of the show selected button
  const checkboxes = isPressed ? getCheckedCheckboxes({ checked: true, selections }) : getCheckboxes({ selections });
  // Loop through the checkboxes
  checkboxes.forEach((checkbox) => {
    // Get the `data-filter-value` value
    const value = checkbox.dataset.filterValue.toLowerCase();
    // Check if the value includes the filter string
    if (value.includes(filter.toLowerCase())) {
      // Keep the checkbox visible
      checkbox.removeAttribute('style');
    } else {
      // Hide the checkbox if it doesn't match the filter
      checkbox.setAttribute('style', 'display: none;');
    }
  });
};

const handleSelectionsCheckboxChange = ({
  button,
  getVisibleCheckedCheckboxes = getSelectionsVisibleCheckedCheckboxes,
  selections,
  showSelectedButton = toggleShowSelectedButtonVisibility,
  updateButtonCount = updateShowSelectedButtonCount
}) => {
  // Get the number of visible checked checkboxes
  const visibleCheckedCheckboxes = getVisibleCheckedCheckboxes({ selections });
  // Update the count
  updateButtonCount({ button, count: visibleCheckedCheckboxes.length, selections });
  // Toggle show selected button
  showSelectedButton({ button, count: visibleCheckedCheckboxes.length, selections });
  // TO DO: Toggle current active filters
};

const selectionsCheckboxChange = ({
  button,
  handleCheckboxChange = handleSelectionsCheckboxChange,
  selections
}) => {
  // Get the fieldset
  const fieldset = selections.querySelector('fieldset');
  // Check if there is a change inside the fieldset
  fieldset.addEventListener('change', (event) => {
    // Check if the change happened to a checkbox
    if (event.target.closest('.additional-option__selections--checkbox > input[type="checkbox"]')) {
      handleCheckboxChange({ button, selections });
    }
  });
};

const initializeSelectionsCheckboxes = ({ button, checkboxChange = selectionsCheckboxChange, selections }) => {
  checkboxChange({ button, selections });
};

export {
  filterSelectionsCheckboxes,
  getSelectionsCheckboxes,
  getSelectionsCheckboxesByState,
  getSelectionsVisibleCheckedCheckboxes,
  handleSelectionsCheckboxChange,
  initializeSelectionsCheckboxes,
  selectionsCheckboxChange,
  toggleSelectionsUncheckedCheckboxes
};
