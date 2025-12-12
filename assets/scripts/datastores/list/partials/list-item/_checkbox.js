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

const selectedCitations = ({ list, type }) => {
  // Make sure `type` is either `csl` or `ris`
  if (!type || !['csl', 'ris'].includes(type)) {
    return null;
  }

  // Create an array of the citation type of all selected records
  return filterSelectedRecords().map((record) => {
    const [datastore, recordId] = record.split(',');
    return list[datastore][recordId].citation[type];
  });
};

export { filterSelectedRecords, getCheckboxes, getCheckedCheckboxes, selectedCitations, someCheckboxesChecked };
