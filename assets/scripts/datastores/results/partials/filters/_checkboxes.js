const checkboxFilters = () => {
  const form = document.querySelector('.filter__checkboxes');

  // Exit if no form is found
  if (!form) {
    return;
  }

  // Watch for checkbox changes to update the form
  form.addEventListener('change', (event) => {
    if (event.target.matches(`input[type="checkbox"]`)) {
      // Submit the form when any checkbox changes
      form.submit();
    }
  });
};

export { checkboxFilters };
