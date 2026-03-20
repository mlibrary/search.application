import { cacheRISData } from './ris/_textarea.js';

const initializeRIS = ({
  cacheRIS = cacheRISData,
  list
}) => {
  // Cache the RIS data
  cacheRIS({ list });
};

export {
  initializeRIS
};
