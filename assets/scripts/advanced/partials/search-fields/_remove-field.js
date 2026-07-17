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

const removeSearchFieldEventListener = ({ handleRemoveField = handleRemoveSearchField, removeSearchFieldButton } = {}) => {
  // Add a `click` event listener to the remove field button
  removeSearchFieldButton.addEventListener('click', (event) => {
    // Get the actual button element
    const button = event.target.closest(removeButtonQuery);
    // Get the value from `data-field-id`
    const id = button.dataset.fieldId;
    // Handle removing the search field
    handleRemoveField({ id });
  });
};

const updateRemoveSearchFieldButtonDataFieldId = ({ index, removeSearchFieldButton } = {}) => {
  // Get the current `data-field-id` attribute value
  const nameAttribute = removeSearchFieldButton.getAttribute('data-field-id');
  // Use regex to replace the index in the `data-field-id` attribute value
  removeSearchFieldButton.setAttribute('data-field-id', nameAttribute.replace(/\d+/u, index));
};

const updateRemoveSearchFieldButton = ({
  getRemoveFieldButton = getRemoveSearchFieldButton,
  index,
  removeSearchFieldEvent = removeSearchFieldEventListener,
  searchField,
  updateDataFieldId = updateRemoveSearchFieldButtonDataFieldId
} = {}) => {
  // Get the remove search field button for the given search field
  const removeSearchFieldButton = getRemoveFieldButton({ searchField });
  // Use regex to replace the index in the `data-field-id` attribute value
  updateDataFieldId({ index, removeSearchFieldButton });
  // Remove the `style` attribute from the button to make it visible
  removeSearchFieldButton.removeAttribute('style');
  // Add the event listener to the remove search field button
  removeSearchFieldEvent({ removeSearchFieldButton });
};

const removeSearchField = ({ removeSearchFieldButtons = getAllRemoveSearchFieldButtons(), removeSearchFieldEvent = removeSearchFieldEventListener } = {}) => {
  // Loop through all existing remove field buttons
  removeSearchFieldButtons.forEach((removeSearchFieldButton) => {
    // Add the event listener to the remove field button
    removeSearchFieldEvent({ removeSearchFieldButton });
  });
};

export {
  getAllRemoveSearchFieldButtons,
  getRemoveSearchFieldButton,
  handleRemoveSearchField,
  updateRemoveSearchFieldButton,
  removeSearchField
};
