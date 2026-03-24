import { checkboxSelector, someCheckboxesChecked } from '../results/partials/results-list/list-item/header/_checkbox.js';
import { initializeCitations, regenerateCitations } from './actions/action/_citation.js';
import { toggleSelectedAction, updateToggleSelectedAction } from './actions/action/_toggle-selected.js';
import { actionsPanelText } from './actions/_summary.js';
import { copyLink } from './actions/action/_link.js';
import { emailAction } from './actions/action/_email.js';
import { handleSelectAllChange } from './_select-all.js';
import { initializeRIS } from './actions/action/_ris.js';
import { textAction } from './actions/action/_text.js';
import { updateCSLData } from './actions/action/citation/_csl.js';
import { updateRISData } from './actions/action/ris/_textarea.js';

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

const actionChangeFunctions = {
  actionsPanelText,
  disableActionTabs,
  handleSelectAllChange,
  regenerateCitations,
  toggleActionsPanel,
  updateCSLData,
  updateRISData,
  updateToggleSelectedAction
};

const handleActionsPanelChange = ({
  changeFunctions = actionChangeFunctions,
  element
}) => {
  // Watch for changes to the list and update accordingly
  element.addEventListener('change', (event) => {
    if (event.target.matches(`${checkboxSelector}, input[type="checkbox"].select-all__checkbox`)) {
      // Update the toggle selected action based on the current state of the checkboxes
      changeFunctions.updateToggleSelectedAction();

      // Update the Actions panel text depending on how many records are selected
      changeFunctions.actionsPanelText();

      // Disable action tabs if no checkboxes are selected
      changeFunctions.disableActionTabs();

      // Toggle the actions panel open or closed
      changeFunctions.toggleActionsPanel();

      // Update CSL data
      changeFunctions.updateCSLData();

      // Regenerate citations
      changeFunctions.regenerateCitations();

      // Update RIS data
      changeFunctions.updateRISData();

      // Update the state of the `Select All` partial
      changeFunctions.handleSelectAllChange();
    }
  });
};

const initializeActions = ({
  actionsText = actionsPanelText,
  citations = initializeCitations,
  disableActions = disableActionTabs,
  email = emailAction,
  link = copyLink,
  list,
  ris = initializeRIS,
  tabControlFunction = tabControl,
  text = textAction,
  togglePanel = toggleActionsPanel,
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

  // Disable action tabs if no checkboxes are selected
  disableActions();

  // Open or close the actions panel based on if any checkboxes are selected
  togglePanel();
};

export {
  disableActionTabs,
  getActionsPanel,
  getTabPanel,
  handleActionsPanelChange,
  initializeActions,
  isSelected,
  tabControl,
  toggleActionsPanel
};
