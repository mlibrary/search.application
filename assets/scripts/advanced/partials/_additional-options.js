import { initializeAllSelections } from './additional-options/_selections.js';

const initializeAdditionalOptions = ({ selections = initializeAllSelections } = {}) => {
  // Initialize the selections for the additional options
  selections();
};

export {
  initializeAdditionalOptions
};
