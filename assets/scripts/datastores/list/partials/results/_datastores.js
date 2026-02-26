const getDatastoreSections = () => {
  return document.querySelectorAll('.list__datastore');
};

const removeEmptyDatastoreSections = ({ datastores, sections = getDatastoreSections() } = {}) => {
  // Loop through all datastore sections
  sections.forEach((section) => {
    // Get the datastore of the section
    const { datastore } = section.dataset;
    // Check if the datastore is empty
    if (!datastores.includes(datastore)) {
      // Remove the section from the DOM
      section.remove();
    }
  });
};

export { getDatastoreSections, removeEmptyDatastoreSections };
