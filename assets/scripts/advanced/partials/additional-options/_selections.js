import { initializeSelectionsCheckboxes } from './selections/_checkboxes.js';
import { initializeSelectionsFilter } from './selections/_filter.js';
import { initializeShowSelected } from './selections/_show-selected.js';

const getAllSelections = () => {
  return document.querySelectorAll('.additional-option__selections');
};

const initializeSelections = ({
  initializeCheckboxes = initializeSelectionsCheckboxes,
  initializeFilter = initializeSelectionsFilter,
  initializeShowSelectedButton = initializeShowSelected,
  selections
} = {}) => {
  // Initialize the filter element for the current selections
  initializeFilter({ selections });
  // Initialize the checkbox element for the current selections
  initializeCheckboxes({ selections });
  // Initialize the show selected element for the current selections
  initializeShowSelectedButton({ selections });
};

const initializeAllSelections = ({ allSelections = getAllSelections(), initialize = initializeSelections } = {}) => {
  // Loop through all selections
  allSelections.forEach((selections) => {
    // Initialize each selection
    initialize({ selections });
  });
};

export {
  getAllSelections,
  initializeAllSelections,
  initializeSelections
};
