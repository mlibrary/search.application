const removeButtonQuery = 'button.advanced-search__remove-field';

const getAllRemoveSearchFieldButtons = () => {
  return document.querySelectorAll(removeButtonQuery);
};

const getRemoveSearchFieldButton = ({ searchField } = {}) => {
  return searchField.querySelector(removeButtonQuery);
};

const handleRemoveSearchField = ({ id } = {}) => {
  // Get the search field
  const field = document.getElementById(id);
  // Check if the field exists
  if (field) {
    // Remove the field from the DOM
    field.remove();
  }
};

const removeSearchField = ({ handleRemoveField = handleRemoveSearchField, removeSearchFieldButtons = getAllRemoveSearchFieldButtons() } = {}) => {
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
  getAllRemoveSearchFieldButtons,
  getRemoveSearchFieldButton,
  handleRemoveSearchField,
  removeSearchField
};
