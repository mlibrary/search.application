const deselectAll = () => {
  const button = document.querySelector('button.list__button--deselect-all');
  const checkboxes = document.querySelectorAll('input[type="checkbox"].list__item--checkbox');
  const someAreChecked = [...checkboxes].some((checkbox) => {
    return checkbox.checked;
  });

  // Toggle button display if some checkboxes are checked
  if (someAreChecked) {
    button.removeAttribute('style');
  } else {
    button.style.display = 'none';
  }

  // Uncheck all checkboxes on click
  button.addEventListener('click', () => {
    checkboxes.forEach((checkbox) => {
      checkbox.removeAttribute('checked');
    });
  });
};

export default deselectAll;
