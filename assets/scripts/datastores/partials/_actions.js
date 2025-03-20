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

export { actionsPlacement, tabControl };
