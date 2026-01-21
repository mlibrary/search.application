import { viewingTemporaryList } from '../../../list/layout.js';

const toggleAddSelected = ({ isAdded, isTemporaryList = viewingTemporaryList() } = {}) => {
  const actionId = 'actions__add-selected';
  const tab = document.querySelector(`#${actionId}`);
  const tabpanel = document.querySelector(`#${actionId}--tabpanel`);

  // Only show if not viewing the temporary list and not already added
  const showAction = !isTemporaryList && !isAdded;

  // Show or hide the tab based on the `showAction` flag
  if (showAction) {
    tab.removeAttribute('style');
  } else {
    tab.style.display = 'none';
  }

  // If the tab is hidden...
  if (tab.style.display === 'none') {
    // Set `aria-selected` to `false`
    tab.setAttribute('aria-selected', 'false');
    // Hide the tabpanel
    tabpanel.style.display = 'none';
  }
};

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

const addSelected = ({ toggleAction = toggleAddSelected } = {}) => {
  toggleAction({ isAdded: false });
};

export { addSelected, fetchAndAddRecord, toggleAddSelected };
