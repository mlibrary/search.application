import { initializeDateTypes } from './date/_radio-buttons.js';
import { initializeYearChanges } from './date/_years.js';

const initializeDateOptions = ({ dateTypeChanges = initializeDateTypes, yearChanges = initializeYearChanges } = {}) => {
  // Initialize the date type selections for Date of Publication
  dateTypeChanges();
  // Initialize the year changes for Date of Publication
  yearChanges();
};

export { initializeDateOptions };
