import { initializeAllSelections } from './additional-options/_selections.js';
import { initializeDateOptions } from './additional-options/_date.js';
import { initializeNarrowSearchTo } from './additional-options/_narrow_search_to.js';

const initializeAdditionalOptions = ({ date = initializeDateOptions, selections = initializeAllSelections, narrowSearchTo = initializeNarrowSearchTo } = {}) => {
  // Initialize the dates for the additional options
  date();
  // Initialize the narrow search to section for the additional options
  narrowSearchTo();
  // Initialize the selections for the additional options
  selections();
};

export {
  initializeAdditionalOptions
};
