// Hide first three table rows
const hideTableRows = (tableRows) => {
  tableRows.forEach((tableRow, index) => {
    if (index > 10) {
      tableRow.style.display = 'none';
    }
  });
};

const toggleHolding = () => {
  // Get all toggle buttons for metadata
  const buttons = document.querySelectorAll('button.holding__table--toggle');

  buttons.forEach((button) => {
    const table = document.getElementById(button.getAttribute('aria-controls'));
    const tableRows = table.querySelectorAll(':scope > tbody > tr');

    // Hide the button if there are ten or fewer table rows
    if (tableRows.length <= 10) {
      button.style.display = 'none';
      return;
    }

    // Store the original text for toggling
    const textHideRows = button.textContent;
    const textShowRows = button.textContent.replace('fewer', `all ${tableRows.length}`);

    // Hide all table rows except the first three
    hideTableRows(tableRows);
    button.textContent = textShowRows;
    button.setAttribute('aria-expanded', 'false');

    // Apply toggle logic
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', !isExpanded);
      button.textContent = isExpanded ? textShowRows : textHideRows;
      if (isExpanded) {
        hideTableRows(tableRows);
      } else {
        tableRows.forEach((tableRow) => {
          tableRow.removeAttribute('style');
        });
      }
    });
  });
};

export default toggleHolding;
