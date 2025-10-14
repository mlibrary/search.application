const getCheckboxes = () => {
  return document.querySelectorAll(`ol.list__items input[type="checkbox"].list__item--checkbox`);
};

const filterSelectedRecords = () => {
  return [...getCheckboxes()].filter((checkbox) => {
    return checkbox.checked === true;
  }).map((checkbox) => {
    return checkbox.value;
  });
};

const someCheckboxesChecked = (checked = false) => {
  return [...getCheckboxes()].some((checkbox) => {
    return checkbox.checked === checked;
  });
};

export { filterSelectedRecords, getCheckboxes, someCheckboxesChecked };
