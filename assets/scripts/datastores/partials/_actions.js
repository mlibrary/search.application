import { changeAlert } from './actions/_alert.js';
import { someCheckboxesChecked } from '../list/partials/list-item/_checkbox.js';

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
  const tabs = document.querySelectorAll('.actions__tablist button[role="tab"]');
  tabs.forEach((tab) => {
    if (!someChecked) {
      if (tab.getAttribute('aria-selected') === 'true') {
        tab.click();
      }
    }
    tab.disabled = !someChecked;
  });
};

const toggleTabDisplay = ({ id, show }) => {
  const tab = document.querySelector(`#${id}`);
  const tabPanel = document.querySelector(`#${tab.getAttribute('aria-controls')}`);

  tab.style.display = show ? 'flex' : 'none';
  tab.setAttribute('aria-selected', show ? tab.getAttribute('aria-selected') : 'false');
  tabPanel.style.display = tab.getAttribute('aria-selected') === 'true' ? 'block' : 'none';
};

export {
  changeAlert,
  disableActionTabs,
  getTabPanel,
  isSelected,
  tabControl,
  toggleTabDisplay
};
