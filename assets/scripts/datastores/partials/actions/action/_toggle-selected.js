import { viewingFullRecord } from '../../../record/layout.js';

const toggleSelectedId = 'actions__toggle-selected';

const getToggleSelectedTab = () => {
  return document.getElementById(toggleSelectedId);
};

const getToggleSelectedTabPanel = () => {
  return document.getElementById(`${toggleSelectedId}--tabpanel`);
};

const updateToggleSelectedTabText = ({ fullRecord = viewingFullRecord(), tab = getToggleSelectedTab() }) => {
  // Return early if not a full record
  if (!fullRecord) {
    return;
  }

  // Loop through all text elements in the tab
  tab.querySelectorAll('.actions__toggle-selected--text').forEach((textElement) => {
    // Replace `selected` with `record` in the tab text
    textElement.textContent = textElement.textContent.replace('selected', 'record');
  });
};

const toggleActionClasses = ({ inList, tab = getToggleSelectedTab(), tabPanel = getToggleSelectedTabPanel() }) => {
  // Toggle the tab class to indicate whether the action will remove the selected record(s) or not
  tab.classList.toggle('actions__toggle-selected--remove', inList);
  // Toggle the tab panel class to indicate whether the action will remove the selected record(s) or not
  tabPanel.classList.toggle('actions__toggle-selected--tabpanel-remove', inList);
};

const toggleSelectedAction = ({
  list,
  toggleClasses = toggleActionClasses,
  updateText = updateToggleSelectedTabText
} = {}) => {
  // eslint-disable-next-line no-console
  console.log(list);

  // Update the tab text
  updateText();

  // Update the tab and tab panel classes
  toggleClasses({ inList: true });
};

export {
  getToggleSelectedTab,
  getToggleSelectedTabPanel,
  toggleActionClasses,
  toggleSelectedAction,
  updateToggleSelectedTabText
};
