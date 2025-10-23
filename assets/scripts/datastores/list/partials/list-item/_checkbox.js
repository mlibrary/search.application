import { getTemporaryList } from '../_add-to.js';

const checkboxSelector = 'ol.list__items input[type="checkbox"].list__item--checkbox';

const getCheckboxes = () => {
  return document.querySelectorAll(checkboxSelector);
};

const getCheckedCheckboxes = () => {
  return document.querySelectorAll(`${checkboxSelector}:checked`);
};

const filterSelectedRecords = () => {
  return [...getCheckedCheckboxes()].map((checkbox) => {
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

const selectedCitations = (type) => {
  // Make sure `type` is either `csl` or `ris`
  if (!type || !['csl', 'ris'].includes(type)) {
    return null;
  }

  // Save the temporary list
  const temporaryList = getTemporaryList();

  // Create an array of the citation type of all selected records
  return filterSelectedRecords().map((record) => {
    const [datastore, recordId] = record.split(',');
    return temporaryList[datastore][recordId].citation[type];
  });
};

export { filterSelectedRecords, getCheckboxes, getCheckedCheckboxes, selectedCitations, someCheckboxesChecked };
