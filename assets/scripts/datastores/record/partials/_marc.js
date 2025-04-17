// Make a button toggle the visibility of the MARC data table
const toggleMARCData = () => {
  const marcDataButton = document.querySelector('.marc-data .marc-data__button');
  // Ensure the button exists because not all records have MARC data
  if (!marcDataButton) {
    return;
  }
  const marcDataButtonText = marcDataButton.innerHTML;
  marcDataButton.addEventListener('click', () => {
    const attribute = 'aria-expanded';
    // Check if the button is already expanded
    const isExpanded = marcDataButton.getAttribute(attribute) === 'true';
    // Toggle the expanded state
    marcDataButton.setAttribute(attribute, !isExpanded);
    // Toggle the button text
    marcDataButton.innerHTML = isExpanded ? marcDataButtonText : marcDataButtonText.replace('View', 'Hide');
  });
};

export default toggleMARCData;
