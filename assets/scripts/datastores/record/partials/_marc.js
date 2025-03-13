// Make a button toggle the visibility of the MARC data table
const toggleMARCData = () => {
  const marcDataButton = document.querySelector('.marc-data .marc-data__button');
  const marcDataButtonText = marcDataButton.innerHTML;
  marcDataButton.addEventListener('click', () => {
    // Check if the button is already expanded
    const isExpanded = marcDataButton.getAttribute('aria-expanded') === 'true';
    // Toggle the expanded state
    marcDataButton.setAttribute('aria-expanded', !isExpanded);
    // Toggle the button text
    marcDataButton.innerHTML = isExpanded ? marcDataButtonText : marcDataButtonText.replace('View', 'Hide');
  });
};

export default toggleMARCData;
