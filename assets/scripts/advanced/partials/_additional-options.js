import { initializeAllSelections } from './additional-options/_selections.js';
import { initializeDateOptions } from './additional-options/_date.js';

const initializeAdditionalOptions = ({ date = initializeDateOptions, selections = initializeAllSelections } = {}) => {
  // Initialize the dates for the additional options
  date();
  // Initialize the selections for the additional options
  selections();
};

export {
  initializeAdditionalOptions
};
