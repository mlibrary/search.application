import { getShowSelectedButton, initializeShowSelected } from './selections/_show-selected.js';
import { initializeSelectionsCheckboxes } from './selections/_checkboxes.js';
import { initializeSelectionsFilter } from './selections/_filter.js';

const getAllSelections = () => {
  return document.querySelectorAll('.additional-option__selections');
};

const initializeSelections = ({
  getButton = getShowSelectedButton,
  initializeCheckboxes = initializeSelectionsCheckboxes,
  initializeFilter = initializeSelectionsFilter,
  initializeShowSelectedButton = initializeShowSelected,
  selections
} = {}) => {
  // Save the arguments
  const args = { button: getButton({ selections }), selections };
  // Initialize the filter element for the current selections
  initializeFilter(args);
  // Initialize the checkbox element for the current selections
  initializeCheckboxes(args);
  // Initialize the show selected element for the current selections
  initializeShowSelectedButton(args);
};

const initializeAllSelections = ({
  allSelections = getAllSelections(),
  initialize = initializeSelections
} = {}) => {
  // Loop through all selections
  allSelections.forEach((selections) => {
    // Initialize each element
    initialize({ selections });
  });
};

export {
  getAllSelections,
  initializeAllSelections,
  initializeSelections
};
