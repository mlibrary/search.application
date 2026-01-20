const listButton = () => {
  return document.querySelector('button.action__my-temporary-list');
};

const toggleButtonText = ({ button = listButton(), isAdded }) => {
  // Update the button text
  button.textContent = `${isAdded ? 'Remove from' : 'Add to'} My Temporary List`;
};

const removeRecordFromList = ({ list, recordDatastore, recordId }) => {
  const updatedList = { ...list };
  if (updatedList[recordDatastore] && updatedList[recordDatastore][recordId]) {
    delete updatedList[recordDatastore][recordId];
  }
  return updatedList;
};

const fetchAndAddRecord = async ({ list, recordDatastore, recordId }) => {
  const updatedList = { ...list };

  try {
    // Fetch the record brief
    const response = await fetch(`/${recordDatastore}/record/${recordId}/brief`);
    if (!response.ok) {
      // Return the original list if the fetch fails
      return updatedList;
    }
    // Add the record information to the list
    const data = await response.json();
    updatedList[recordDatastore][recordId] = data;
  } catch {
    // Silent failure, so no action is needed
    return updatedList;
  }

  return updatedList;
};

const handleToggleList = () => {
  //
};

const toggleItemsForList = ({ button = listButton(), handleList = handleToggleList, list }) => {
  button().addEventListener('click', () => {
    return handleList({ list });
  });
};

export {
  fetchAndAddRecord,
  handleToggleList,
  listButton,
  removeRecordFromList,
  toggleButtonText,
  toggleItemsForList
};
