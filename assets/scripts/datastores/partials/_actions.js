import { actionsPanelText } from './actions/_summary.js';
import { copyLink } from './actions/action/_link.js';
import { emailAction } from './actions/action/_email.js';
import { initializeCitations } from './actions/action/_citation.js';
import { initializeRIS } from './actions/action/_ris.js';
import { someCheckboxesChecked } from '../results/partials/results-list/list-item/header/_checkbox.js';
import { textAction } from './actions/action/_text.js';
import { toggleSelectedAction } from './actions/action/_toggle-selected.js';

const getActionsPanel = () => {
  return document.querySelector('details.actions');
};

const toggleActionsPanel = ({ actionsPanel = getActionsPanel(), someChecked = someCheckboxesChecked(true) } = {}) => {
  actionsPanel.toggleAttribute('open', someChecked);
};

const isSelected = ({ tab }) => {
  return tab.getAttribute('aria-selected') === 'true';
};

const getTabPanel = ({ tab, tabContainer }) => {
  return tabContainer.querySelector(`#${tab.getAttribute('aria-controls')}`);
};

const tabControl = (element) => {
  const attribute = 'aria-selected';
  const tabContainer = document.querySelector(element);
  const tabList = tabContainer.querySelector('[role="tablist"]');
  const tabs = tabList.querySelectorAll('[role="tab"]');
  tabs.forEach((tab) => {
    // Hide tab panels that are not selected
    const tabPanel = getTabPanel({ tab, tabContainer });
    tabPanel.style.display = isSelected({ tab }) ? 'block' : 'none';
    tab.addEventListener('click', (event) => {
      // Change `aria-selected` to the opposite of its current value
      event.target.setAttribute(attribute, !isSelected({ tab: event.target }));
      // Display the tab panel of the selected tab, if it is selected
      tabPanel.style.display = isSelected({ tab: event.target }) ? 'block' : 'none';
      // Hide and unselect all other tab panels
      tabs.forEach((otherTab) => {
        if (otherTab !== event.target) {
          otherTab.setAttribute(attribute, false);
          const otherTabPanel = getTabPanel({ tab: otherTab, tabContainer });
          otherTabPanel.style.display = 'none';
          // Hide alerts when tabpanel is hidden
          const alerts = otherTabPanel.querySelectorAll('.alert');
          alerts.forEach((alert) => {
            alert.style.display = 'none';
          });
        }
      });
    });
  });
};

const disableActionTabs = ({ someChecked = someCheckboxesChecked(true) } = {}) => {
  // Grab all the tabs except the `Copy link` tab
  const tabs = document.querySelectorAll('.actions__tablist button[role="tab"]:not(#actions__link)');

  // Loop through all the tabs
  tabs.forEach((tab) => {
    // Check if all checkboxes are unchecked, and the tab is selected
    if (!someChecked && tab.getAttribute('aria-selected') === 'true') {
      // Click the tab to deselect it
      tab.click();
    }
    // Toggle the `disabled` attribute based on the `someChecked` value
    tab.toggleAttribute('disabled', !someChecked);
  });
};

/*
Const handleActionsPanelChange = () => {
  // Disable
  // Text
  // Toggle details open/close on actions panel
  // Citations
  // RIS
};
*/

const initializeActions = ({
  actionsText = actionsPanelText,
  citations = initializeCitations,
  email = emailAction,
  link = copyLink,
  list,
  ris = initializeRIS,
  tabControlFunction = tabControl,
  text = textAction,
  toggleSelected = toggleSelectedAction
} = {}) => {
  // Actions panel
  tabControlFunction('.actions');

  // Copy link
  link();

  // Toggle add/remove selected
  // Initialize this action before the rest to ensure the necessary state is set for all checkboxes
  toggleSelected({ list });

  // Email
  email();

  // Text
  text();

  // Citations
  citations({ list });

  // RIS
  ris({ list });

  // Update actions panel text
  actionsText();
};

export {
  disableActionTabs,
  getActionsPanel,
  getTabPanel,
  initializeActions,
  isSelected,
  tabControl,
  toggleActionsPanel
};
