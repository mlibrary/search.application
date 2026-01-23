import { changeAlert } from './actions/_alert.js';
import { someCheckboxesChecked } from '../list/partials/list-item/_checkbox.js';
import { viewingTemporaryList } from '../list/layout.js';

const isSelected = (tab) => {
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
    tabPanel.style.display = isSelected(tab) ? 'block' : 'none';
    tab.addEventListener('click', (event) => {
      // Change `aria-selected` to the opposite of its current value
      event.target.setAttribute(attribute, !isSelected(event.target));
      // Display the tab panel of the selected tab, if it is selected
      tabPanel.style.display = isSelected(event.target) ? 'block' : 'none';
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

const disableActionTabs = () => {
  // Only run if viewing the temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  const someChecked = someCheckboxesChecked(true);
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

const fetchFormResults = async ({ form }) => {
  const formData = new FormData(form);

  const response = await fetch(form.action, {
    body: formData,
    headers: {
      Accept: 'application/json'
    },
    method: form.method
  });

  return response;
};

const shareForm = (panel, formResults = fetchFormResults) => {
  const form = document.querySelector(`${panel} form:not(.login__form)`);

  // Return if form not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    changeAlert({
      alert: document.querySelector(`${panel} .alert`),
      response: await formResults({ form })
    });
  });
};

const copyToClipboard = ({ alert, text }) => {
  if (alert) {
    alert.style.display = 'block';
  }
  return navigator.clipboard.writeText(text);
};

export {
  changeAlert,
  copyToClipboard,
  disableActionTabs,
  fetchFormResults,
  getTabPanel,
  isSelected,
  shareForm,
  tabControl
};
