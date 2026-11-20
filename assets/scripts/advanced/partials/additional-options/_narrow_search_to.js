const getAllNarrowSearchToSections = () => {
  return document.querySelectorAll('.additional-option__narrow-search-to--section');
};

const toggleNarrowSearchToSectionSibling = ({ sectionName, sibling, value } = {}) => {
  // Check if the section name includes the library section value or is empty
  if (sectionName.includes(value) || sectionName === '') {
    // Show the section if its name includes the section value
    sibling.removeAttribute('style');
  } else {
    // Hide the section if its name does not include the section value
    sibling.style.display = 'none';
  }
};

const resetNarrowSearchToSelectionSelect = ({ selectElement } = {}) => {
  // Reset the select element to its default selected value
  selectElement.selectedIndex = 0;
};

const toggleNarrowSearchToSelectOptions = ({ sectionName, selectElement, value } = {}) => {
  // Get select element options
  const selectOptions = selectElement.querySelectorAll('option');
  // Loop through each option
  selectOptions.forEach((option) => {
    // Get the `data-narrow` attribute of the option
    const optionNarrow = option.dataset.narrow;
    // Check if the section name includes the value and the option is relevant
    if (sectionName.includes(value) && (optionNarrow.includes(value) || optionNarrow === '')) {
      // Show the option if it is relevant
      option.removeAttribute('style');
    } else {
      // Hide the option if it is not relevant
      option.style.display = 'none';
    }
  });
};

const toggleNarrowSearchToSectionSiblingSelect = ({
  resetSelect = resetNarrowSearchToSelectionSelect,
  sectionName,
  selectElement,
  toggleSelectOptions = toggleNarrowSearchToSelectOptions,
  value
} = {}) => {
  // Reset the select element to its default selected value
  resetSelect({ selectElement });
  // Toggle the select element options based on the section name and value
  toggleSelectOptions({ sectionName, selectElement, value });
};

const narrowSearchToSectionSiblingChange = ({
  sibling,
  toggleSectionSibling = toggleNarrowSearchToSectionSibling,
  toggleSectionSiblingSelect = toggleNarrowSearchToSectionSiblingSelect,
  value
} = {}) => {
  // Return early if there is no sibling or value
  if (!sibling || !value) {
    return;
  }
  // Get the `data-narrow` attribute of the section
  const sectionName = sibling.dataset.narrow;

  // Toggle the section's sibling
  toggleSectionSibling({ sectionName, sibling, value });

  // Get the `select` element within the section
  const selectElement = sibling.querySelector('select');

  // Return early if there is no select element
  if (!selectElement) {
    return;
  }

  // Toggle the sibling's select element and options
  toggleSectionSiblingSelect({ sectionName, selectElement, value });
};

const narrowSearchToSectionSiblingsChanges = ({
  parentElement,
  siblingChange = narrowSearchToSectionSiblingChange,
  value
} = {}) => {
  // Create a siblings array
  const siblings = [];
  // Loop through all next siblings of the parent element
  for (
    let siblingElement = parentElement.nextElementSibling;
    siblingElement;
    siblingElement = siblingElement.nextElementSibling
  ) {
    // Add the current sibling to the siblings array
    siblings.push(siblingElement);
  }

  // Loop through the section's siblings
  siblings.forEach((sibling) => {
    // Apply changes to the sibling
    siblingChange({ sibling, value });
  });
};

const handleNarrowSearchToSectionChange = ({
  section,
  siblingsChanges = narrowSearchToSectionSiblingsChanges
} = {}) => {
  // Attach a change event listener to each section
  section.addEventListener('change', (event) => {
    // Get the event target
    const { target } = event;
    // Check if the changed element is a select element
    if (target.matches('select')) {
      // Get the target's parent element and value
      const { parentElement, value } = target;
      // Apply the section change logic based on the selected value
      siblingsChanges({ parentElement, value });
    }
  });
};

const initializeNarrowSearchTo = ({ allNarrowSearchToSections = getAllNarrowSearchToSections(), handleToggle = handleNarrowSearchToSectionChange } = {}) => {
  // Loop through all sections
  allNarrowSearchToSections.forEach((section) => {
    // Handle toggle on change events
    handleToggle({ section });
  });
};

export {
  getAllNarrowSearchToSections,
  handleNarrowSearchToSectionChange,
  initializeNarrowSearchTo,
  narrowSearchToSectionSiblingChange,
  narrowSearchToSectionSiblingsChanges,
  resetNarrowSearchToSelectionSelect,
  toggleNarrowSearchToSectionSiblingSelect,
  toggleNarrowSearchToSectionSibling,
  toggleNarrowSearchToSelectOptions
};
