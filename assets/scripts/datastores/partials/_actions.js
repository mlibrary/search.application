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

const actionsPlacement = () => {
  const record = document.querySelector('.record');
  const actions = record.querySelector('.actions');
  const actionsDesktop = record.querySelector('.actions__desktop');
  const actionsMobile = record.querySelector('.actions__mobile');
  const moveElementBasedOnWindowSize = () => {
    const targetParent = window.innerWidth > 820 ? actionsDesktop : actionsMobile;
    if (actions.parentNode !== targetParent) {
      targetParent.appendChild(actions);
    }
  };

  window.addEventListener('resize', moveElementBasedOnWindowSize);

  moveElementBasedOnWindowSize();
};

const fetchFormResults = async (form) => {
  const formData = new FormData(form);

  const response = await fetch(form.action, {
    body: formData,
    method: form.method
  });

  return response;
};

const changeAlert = async ({ element, response }) => {
  const json = await response.json();
  const alert = document.querySelector(element);
  alert.classList.replace('alert__warning', `alert__${response.ok ? 'success' : 'error'}`);
  alert.textContent = json.message;
  alert.style.display = 'block';
};

export {
  actionsPlacement,
  changeAlert,
  fetchFormResults,
  tabControl
};
