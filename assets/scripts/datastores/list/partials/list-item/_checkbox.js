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

const checkboxChangeHandler = ({ checkboxes = getCheckboxes(), func, ...args }) => {
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      func({ ...args });
    });
  });
};

export {
  checkboxChangeHandler,
  filterSelectedRecords,
  getCheckboxes,
  getCheckedCheckboxes,
  someCheckboxesChecked,
  splitCheckboxValue,
  toggleCheckedState
};
