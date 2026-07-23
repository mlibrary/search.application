import { initializeSelections } from './additional-options/_selections.js';

const initializeAdditionalOptions = ({ selections = initializeSelections } = {}) => {
  // Initialize the selections for the additional options
  selections();
};

export {
  initializeAdditionalOptions
};
