const checkboxSelector = 'input[type="checkbox"].list__item--checkbox';

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

const splitCheckboxValue = ({ value }) => {
  const [recordDatastore, recordId] = value.split(',');
  return { recordDatastore, recordId };
};

const selectedCitations = ({ list, splitValue = splitCheckboxValue, type }) => {
  // Make sure `type` is either `csl` or `ris`
  if (!type || !['csl', 'ris'].includes(type)) {
    return null;
  }

  // Create an array of the citation type of all selected records
  return filterSelectedRecords().map((record) => {
    const { recordDatastore, recordId } = splitValue({ value: record });
    return list[recordDatastore][recordId].citation[type];
  });
};

export {
  filterSelectedRecords,
  getCheckboxes,
  getCheckedCheckboxes,
  selectedCitations,
  someCheckboxesChecked,
  splitCheckboxValue
};
