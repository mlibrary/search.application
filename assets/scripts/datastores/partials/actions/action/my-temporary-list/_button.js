const toggleButtonText = ({ button, isAdded }) => {
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

const fetchAndAddRecord = async ({ list, recordDatastore, recordId, url }) => {
  const updatedList = { ...list };

  try {
    const response = await fetch(url);
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

export {
  fetchAndAddRecord,
  removeRecordFromList,
  toggleButtonText
};
