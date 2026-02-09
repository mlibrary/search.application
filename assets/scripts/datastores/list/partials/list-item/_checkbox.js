import { viewingFullRecord } from '../../../record/layout.js';

const checkboxSelector = 'input[type="checkbox"].list__item--checkbox:not([value=""])';

const getCheckboxes = () => {
  return document.querySelectorAll(checkboxSelector);
};

const toggleCheckedState = ({ checkbox, isAdded, viewingRecord = viewingFullRecord() }) => {
  // Do not change the checked state if viewing a full record
  if (viewingRecord) {
    return;
  }

  // Set the checkbox checked state
  checkbox.checked = isAdded;
};

const getCheckedCheckboxes = () => {
  return document.querySelectorAll(`${checkboxSelector}:checked`);
};

const filterSelectedRecords = ({ checkedCheckboxes = getCheckedCheckboxes() } = {}) => {
  return [...checkedCheckboxes].map((checkbox) => {
    return checkbox.value;
  });
};

const someCheckboxesChecked = (checked = false) => {
  return Boolean(document.querySelector(
    checked
      ? `${checkboxSelector}:checked`
      : `${checkboxSelector}:not(:checked)`
  ));
};

const splitCheckboxValue = ({ value }) => {
  const [recordDatastore, recordId] = value.split(',');
  return { recordDatastore, recordId };
};

const selectedCitations = ({ filteredValues = filterSelectedRecords(), list, splitValue = splitCheckboxValue, type }) => {
  // Make sure `type` is either `csl` or `ris`
  if (!type || !['csl', 'ris'].includes(type)) {
    return null;
  }

  // Create an array of the citation type of all selected records
  return filteredValues.map((value) => {
    const { recordDatastore, recordId } = splitValue({ value });
    return list[recordDatastore][recordId].citation[type];
  });
};

export {
  filterSelectedRecords,
  getCheckboxes,
  getCheckedCheckboxes,
  selectedCitations,
  someCheckboxesChecked,
  splitCheckboxValue,
  toggleCheckedState
};
