import { cacheRISData, updateRISData } from './ris/_textarea.js';
import { downloadRISFormSubmit } from './ris/_form.js';

const initializeRIS = ({
  cacheRIS = cacheRISData,
  list,
  risFormSubmit = downloadRISFormSubmit,
  updateRISTextarea = updateRISData
}) => {
  // Cache the RIS data
  cacheRIS({ list });

  // Update RIS textarea
  updateRISTextarea();

  // Initialize the RIS form
  risFormSubmit({ list });
};

export {
  initializeRIS
};
