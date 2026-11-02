const getAllNarrowSearchToSections = () => {
  return document.querySelectorAll('.additional-option__narrow-search-to');
};

const getNarrowSearchToSection = ({ section }) => {
  return document.querySelector(`.additional-option__narrow-search-to--${section}`);
};

const getNarrowSearchToSectionSelectValue = ({ narrowSearchToSection = getNarrowSearchToSection, section }) => {
  // Get the section
  const getSection = narrowSearchToSection({ section });
  // Return the value of the select element within the section
  return getSection ? getSection.querySelector('select').value : null;
};

const toggleNarrowSearchToSections = ({
  narrowSearchToSection = getNarrowSearchToSection,
  narrowSearchToSectionValue = getNarrowSearchToSectionSelectValue
} = {}) => {
  // Get the value of the the `Library` select within the section
  const librarySectionValue = narrowSearchToSectionValue({ section: 'library' });
  // Loop through the `location` and `collection` sections
  ['location', 'collection'].forEach((section) => {
    // Get the section
    const singleSection = narrowSearchToSection({ section });
    // Get the `data-narrow` attribute of the section
    const sectionName = singleSection.dataset.narrow;
    // Check if the section name includes the library section value
    if (sectionName.includes(librarySectionValue)) {
      // Show the section if its name includes the library section value
      singleSection.removeAttribute('style');
    } else {
      // Hide the section if its name does not include the library section value
      singleSection.style.display = 'none';
    }
  });
};

const handleToggleNarrowSearchToSection = ({
  allNarrowSearchToSections = getAllNarrowSearchToSections(),
  toggleSections = toggleNarrowSearchToSections
} = {}) => {
  // Loop through all sections
  allNarrowSearchToSections.forEach((section) => {
    // Attach a change event listener to each section
    section.addEventListener('change', (event) => {
      // Check if the changed element is a select element
      if (event.target.matches('select')) {
        // Toggle the visibility of sections
        toggleSections();
        // TO DO: Toggle options
      }
    });
  });
};

const initializeNarrowSearchTo = ({ handleToggle = handleToggleNarrowSearchToSection, toggleSections = toggleNarrowSearchToSections } = {}) => {
  // Toggle the sections on load
  toggleSections();
  // Handle toggle on change events
  handleToggle();
};

export {
  getAllNarrowSearchToSections,
  getNarrowSearchToSection,
  getNarrowSearchToSectionSelectValue,
  initializeNarrowSearchTo,
  handleToggleNarrowSearchToSection,
  toggleNarrowSearchToSections
};
