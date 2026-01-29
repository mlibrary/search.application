const fetchAndAddRecord = async ({ list, recordDatastore, recordId }) => {
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
  } catch {
    // Silent failure, so no action is needed
    return updatedList;
  }

  return updatedList;
};

export { fetchAndAddRecord };
