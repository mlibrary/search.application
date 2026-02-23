const libraryScope = () => {
  const form = document.querySelector('.library-scope');

  // Exit if no form is found
  if (!form) {
    return;
  }

  // Get the select element
  const select = form.querySelector('select');

  // Listen for changes to the select element
  select.addEventListener('change', () => {
    // Submit the form when the select element changes
    form.submit();
  });
};

export { libraryScope };
