import { getListCitationData, selectedCitations } from '../_citation.js';
import { getCheckboxes } from '../../../../results/partials/results-list/list-item/header/_checkbox.js';
import { viewingTemporaryList } from '../../../../list/layout.js';

let cslDataCache = null;

const getCSLTextarea = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const cslData = ({ textArea = getCSLTextarea } = {}) => {
  return JSON.parse(textArea().textContent);
};

const cacheCSLData = ({
  data = cslData(),
  getListData = getListCitationData,
  list,
  temporaryList = viewingTemporaryList(),
  textArea = getCSLTextarea()
} = {}) => {
  // Check if currently viewing My Temporary List
  if (temporaryList) {
    // Cache the CSL data from the list
    cslDataCache = getListData({ list, type: 'csl' });
  } else {
    // Cache the data from the textarea
    cslDataCache = data;
  }

  // Clear the textarea
  textArea.textContent = '';
};

const getSelectedCSLData = ({
  cachedData = cslDataCache,
  checkboxes = getCheckboxes()
} = {}) => {
  // Loop through all the checkboxes
  return [...checkboxes].flatMap((checkbox, index) => {
    // If the checkbox is checked, return the corresponding cached data item; otherwise, return an empty array
    return checkbox.checked ? [cachedData[index]] : [];
  });
};

const updateCSLData = ({
  getCSLData = getSelectedCSLData(),
  textArea = getCSLTextarea()
} = {}) => {
  // Update the textarea with the selected data
  textArea.textContent = JSON.stringify(getCSLData);
};

const displayCSLData = ({ getCitations = selectedCitations, list, textArea = getCSLTextarea }) => {
  // Apply the data to the textarea
  textArea().textContent = JSON.stringify(getCitations({ list, type: 'csl' }));
};

export {
  cacheCSLData,
  cslData,
  cslDataCache,
  displayCSLData,
  getCSLTextarea,
  getSelectedCSLData,
  updateCSLData
};
