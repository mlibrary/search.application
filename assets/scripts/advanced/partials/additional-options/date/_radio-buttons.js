import { getYearElement, toggleYearElements } from './_years.js';

const getDateTypeFieldset = () => {
  return document.querySelector('.additional-option__date--types');
};

const handleDateTypeChanges = ({
  endYear,
  fieldset,
  startYear,
  toggleYears = toggleYearElements
} = {}) => {
  // Detect change in the fieldset
  fieldset.addEventListener('change', (event) => {
    // Check if event was a radio button
    if (event.target?.type === 'radio') {
      // Toggle the visibility of the year elements based on the selected value
      toggleYears({ endYear, startYear, value: event.target.value });
    }
  });
};

const initializeDateTypes = ({
  dateTypeChanges = handleDateTypeChanges,
  fieldset = getDateTypeFieldset(),
  getYear = getYearElement,
  toggleYears = toggleYearElements
} = {}) => {
  // Return early if no fieldset is found
  if (!fieldset) {
    return;
  }

  // Get the date year elements
  const startYear = getYear({ year: 'start' });
  const endYear = getYear({ year: 'end' });

  // Get the current selected date type
  const selectedValue = fieldset.querySelector('input[type="radio"]:checked')?.value || 'Before';

  // Toggle the visibility of the year elements based on the selected value
  toggleYears({ endYear, startYear, value: selectedValue });
  dateTypeChanges({ endYear, fieldset, startYear });
};

export {
  getDateTypeFieldset,
  handleDateTypeChanges,
  initializeDateTypes
};
