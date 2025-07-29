const selectAll = () => {
  const button = document.querySelector('button.list__button--select-all');
  const checkboxes = document.querySelectorAll('input[type="checkbox"].list__item--checkbox');
  const allAreSelected = [...checkboxes].every((checkbox) => {
    return checkbox.checked;
  });

  // Toggle button display if all checkboxes are checked
  if (allAreSelected) {
    button.style.display = 'none';
  } else {
    button.removeAttribute('style');
  }

  // Check all checkboxes on click
  button.addEventListener('click', () => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
    });
  });
};

export default selectAll;
