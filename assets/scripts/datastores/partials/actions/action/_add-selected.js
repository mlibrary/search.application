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

const addSelected = ({ toggleAction = toggleAddSelected } = {}) => {
  toggleAction({ isAdded: false });
};

export { addSelected, toggleAddSelected };
