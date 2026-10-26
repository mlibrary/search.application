import { getSearchOptionsDropdown } from './_search-options.js';

const getSearchTips = ({ searchField }) => {
  return searchField.querySelectorAll(`.search-form__tip`);
};

// Toggle visibility of every search tip if `data-value` matches the selected value
const handleSearchTipChange = ({ searchField, searchTips = getSearchTips, value } = {}) => {
  // Loop through the search tips and toggle visibility based on the selected value
  searchTips({ searchField }).forEach((tip) => {
    tip.style.display = tip.getAttribute('data-value') === value ? 'flex' : 'none';
  });
};

// Display the selected search tip
const displaySearchTip = ({ handleTipChange = handleSearchTipChange, searchField = document.querySelector('.search-form'), searchOptionsDropdown = getSearchOptionsDropdown } = {}) => {
  // If there is no search field, return early
  if (!searchField) {
    return;
  }
  // Get the dropdown
  const dropdown = searchOptionsDropdown({ searchField });
  // If there is no dropdown, return early
  if (!dropdown) {
    return;
  }
  // Display the selected tip on load
  handleTipChange({ searchField, value: dropdown.value });
  // Display the selected tip on change
  dropdown.addEventListener('change', (event) => {
    handleTipChange({ searchField, value: event.target.value });
  });
};

export {
  displaySearchTip,
  getSearchTips,
  handleSearchTipChange
};
