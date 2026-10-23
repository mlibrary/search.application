const getYearElement = ({ year }) => {
  return document.querySelector(`.additional-option__date--year-${year}`);
};

const toggleYearElement = ({ hide = true, yearElement }) => {
  // Toggle the element's visibility
  if (hide) {
    yearElement.style.display = 'none';
  } else {
    yearElement.removeAttribute('style');
  }
  // Get the element's input
  const yearElementInput = yearElement.querySelector('input');
  // Disable the input if the element is hidden
  yearElementInput.disabled = hide;
};

const toggleYearElements = ({ endYear, hideYearElement = toggleYearElement, startYear, value }) => {
  hideYearElement({ hide: value === 'Before', yearElement: startYear });
  hideYearElement({ hide: ['After', 'In'].includes(value), yearElement: endYear });
};

const handleStartDateChange = ({ endDateNumber, startDateNumber } = {}) => {
  startDateNumber.addEventListener('change', (event) => {
    const startDateValue = event.target.value;
    const emptyValue = startDateValue === '';
    endDateNumber.disabled = emptyValue;
    if (emptyValue) {
      endDateNumber.value = '';
    } else {
      endDateNumber.min = String(Number(startDateValue) + 1);
    }
  });
};

const handleEndDateChange = ({ endDateNumber, startDateNumber } = {}) => {
  endDateNumber.addEventListener('change', (event) => {
    const endDateValue = event.target.value;
    if (endDateValue !== '') {
      startDateNumber.max = String(Number(endDateValue) - 1);
    }
  });
};

const handleDateChanges = ({ endDateChange = handleEndDateChange, endDateNumber, startDateChange = handleStartDateChange, startDateNumber } = {}) => {
  // Initialize changes to `Start Date`
  startDateChange({ endDateNumber, startDateNumber });
  // Initialize changes to `End Date`
  endDateChange({ endDateNumber, startDateNumber });
};

const initializeYearChanges = ({ dateChanges = handleDateChanges, yearElement = getYearElement } = {}) => {
  // Get year element inputs
  const startDateNumber = yearElement({ year: 'start' })?.querySelector('input');
  const endDateNumber = yearElement({ year: 'end' })?.querySelector('input');

  // Return early if either start or end date input is not found
  if (!startDateNumber || !endDateNumber) {
    return;
  }

  // Initialize changes to dates
  dateChanges({ endDateNumber, startDateNumber });
};

export {
  getYearElement,
  handleDateChanges,
  handleEndDateChange,
  handleStartDateChange,
  initializeYearChanges,
  toggleYearElement,
  toggleYearElements
};
