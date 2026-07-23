import { initializeSelectionsFilter } from './selections/_filter.js';

const getAllSelections = () => {
  return document.querySelectorAll('.additional-option__selections');
};

const initializeSelections = ({ allSelections = getAllSelections(), initializeFilter = initializeSelectionsFilter } = {}) => {
  // Loop through all selections
  allSelections.forEach((selections) => {
    // Initialize the filter element for the current selection
    initializeFilter({ selections });
  });
};

export {
  getAllSelections,
  initializeSelections
};
