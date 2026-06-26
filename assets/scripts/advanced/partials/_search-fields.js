const removeButtonQuery = 'button.advanced-search__remove-field';

const getSearchField = ({ id } = {}) => {
  return document.getElementById(id);
};

const getRemoveSearchFieldButtons = () => {
  return document.querySelectorAll(removeButtonQuery);
};

const handleRemoveSearchField = ({ id, searchField = getSearchField } = {}) => {
  // Get the search field
  const field = searchField({ id });
  // Check if the field exists
  if (field) {
    // Remove the field from the DOM
    field.remove();
  }
};

const removeSearchField = ({ handleRemoveField = handleRemoveSearchField, removeSearchFieldButtons = getRemoveSearchFieldButtons() } = {}) => {
  // Loop through all remove field buttons
  removeSearchFieldButtons.forEach((removeSearchFieldButton) => {
    // Add a `click` event listener
    removeSearchFieldButton.addEventListener('click', (event) => {
      // Get the button element
      const button = event.target.closest(removeButtonQuery);
      // Get the value from `data-field-id`
      const id = button.dataset.fieldId;
      // Handle removing the search field
      handleRemoveField({ id });
    });
  });
};

export {
  getRemoveSearchFieldButtons,
  getSearchField,
  handleRemoveSearchField,
  removeSearchField
};
