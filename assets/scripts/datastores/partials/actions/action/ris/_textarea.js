import { getCheckboxes } from '../../../../results/partials/results-list/list-item/header/_checkbox.js';
import { getListCitationData } from '../_citation.js';
import { viewingTemporaryList } from '../../../../list/layout.js';

let risDataCache = null;

const getRISTextarea = () => {
  return document.querySelector('.action__ris textarea.citation__ris');
};

const risData = ({ textArea = getRISTextarea } = {}) => {
  return JSON.parse(textArea().textContent);
};

const cacheRISData = ({
  data = risData(),
  getListData = getListCitationData,
  list,
  temporaryList = viewingTemporaryList(),
  textArea = getRISTextarea()
} = {}) => {
  // Check if currently viewing My Temporary List
  if (temporaryList) {
    // Cache the CSL data from the list
    risDataCache = getListData({ list, type: 'ris' });
  } else {
    // Cache the data from the textarea
    risDataCache = data;
  }

  // Clear the textarea
  textArea.textContent = '';
};

const getSelectedRISData = ({
  cachedData = risDataCache,
  checkboxes = getCheckboxes()
} = {}) => {
  // Loop through all the checkboxes
  return [...checkboxes].flatMap((checkbox, index) => {
    // If the checkbox is checked, return the corresponding cached data item; otherwise, return an empty array
    return checkbox.checked ? [cachedData[index]] : [];
  });
};

const updateRISData = ({
  getRISData = getSelectedRISData(),
  textArea = getRISTextarea()
} = {}) => {
  // Update the textarea with the selected data
  textArea.textContent = JSON.stringify(getRISData);
};

export {
  cacheRISData,
  getRISTextarea,
  getSelectedRISData,
  risData,
  risDataCache,
  updateRISData
};
