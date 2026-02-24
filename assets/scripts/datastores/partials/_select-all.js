import { getCheckboxes, getCheckedCheckboxes, someCheckboxesChecked } from '../list/partials/list-item/_checkbox.js';
import { viewingTemporaryList } from '../list/layout.js';

const getSelectAllCheckbox = () => {
  return document.querySelector('input[type="checkbox"].select-all__checkbox');
};

const selectAllCheckboxState = ({ checkbox, someChecked = someCheckboxesChecked }) => {
  checkbox.indeterminate = someChecked(true) && someChecked(false);
  checkbox.checked = someChecked(true) && !someChecked(false);
};

const updateSelectedCount = ({ count = getCheckedCheckboxes().length } = {}) => {
  const selectedCount = document.querySelector('.select-all__count--checked');
  selectedCount.textContent = count;
};

const updateTotalCount = ({ count, viewingList = viewingTemporaryList() }) => {
  // Return early if not viewing a temporary list
  if (!viewingList) {
    return;
  }

  // Update the total number of checkboxes that could be selected
  const totalCount = document.querySelector('.select-all__count--total');
  totalCount.textContent = count;

  // Update the text to be plural if there is not only one item
  const selectedText = document.querySelector('.select-all__count--text');
  selectedText.textContent = count === 1 ? 'item' : 'items';
};

const selectAll = ({
  checkbox = getSelectAllCheckbox(),
  checkboxes = getCheckboxes(),
  countSelected = updateSelectedCount,
  countTotal = updateTotalCount,
  selectCheckboxState = selectAllCheckboxState
} = {}) => {
  // Initialize the state of the checkbox
  selectCheckboxState({ checkbox });

  // Update the selected count
  countSelected();

  // Update the total count
  countTotal({ count: checkboxes.length });

  // Add event listener
  checkbox.addEventListener('change', () => {
    // Check all checkboxes if `Select all` checkbox is checked
    const checked = checkbox.checked === true;
    checkboxes.forEach((recordCheckbox) => {
      recordCheckbox.checked = checked;
    });

    // Update the selected count
    countSelected();
  });
};

export {
  getSelectAllCheckbox,
  selectAll,
  selectAllCheckboxState,
  updateSelectedCount,
  updateTotalCount
};
