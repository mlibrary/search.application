const getAddSelectedButton = () => {
  return document.querySelector('#actions__add-selected--tabpanel .action__add-selected');
};

const toggleAddedClass = ({ isAdded, recordDatastore, recordId }) => {
  const className = 'record__container';
  const container = document.querySelector(`.${className}[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);

  // Return early if the container is not found
  if (!container) {
    return;
  }

  // Toggle the class to visually indicate the record is in the temporary list
  container.classList.toggle(`${className}--in-temporary-list`, isAdded);
};

const fetchAndAddRecord = async ({ list, recordDatastore, recordId, toggleClass = toggleAddedClass }) => {
  const updatedList = { ...list };

  try {
    const response = await fetch(`/${recordDatastore}/record/${recordId}/brief`);
    if (!response.ok) {
      // Return the original list if the fetch fails
      return updatedList;
    }
    // Add the record information to the list
    const data = await response.json();
    updatedList[recordDatastore][recordId] = data;

    // Toggle the class to visually indicate the record is in the temporary list
    toggleClass({ isAdded: true, recordDatastore, recordId });
  } catch {
    // Silent failure, so no action is needed
    return updatedList;
  }

  return updatedList;
};

export {
  fetchAndAddRecord,
  getAddSelectedButton,
  toggleAddedClass
};
