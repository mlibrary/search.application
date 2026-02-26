import { viewingFullRecord } from '../../../../../record/layout.js';

const checkboxSelector = 'input[type="checkbox"].record__checkbox:not([value=""])';

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

const updateCheckboxLabel = ({ checkbox, title }) => {
  // Update the checkbox label
  checkbox.setAttribute('aria-label', `Select ${title}`);
};

const updateCheckboxValue = ({ checkbox, recordDatastore, recordId }) => {
  // Update the checkbox value
  checkbox.value = `${recordDatastore},${recordId}`;
};

const splitCheckboxValue = ({ value }) => {
  const [recordDatastore, recordId] = value.split(',');
  return { recordDatastore, recordId };
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

export {
  filterSelectedRecords,
  getCheckboxes,
  getCheckedCheckboxes,
  someCheckboxesChecked,
  splitCheckboxValue,
  toggleCheckedState,
  updateCheckboxLabel,
  updateCheckboxValue
};
