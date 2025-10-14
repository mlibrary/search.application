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

export { filterSelectedRecords, getCheckboxes, getCheckedCheckboxes, someCheckboxesChecked };
