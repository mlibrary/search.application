const getActiveCitationTabpanel = () => {
  const tabpanels = document.querySelectorAll('[role="tabpanel"]');
  return Array.from(tabpanels).find((tabpanel) => {
    return tabpanel.style.display !== 'none';
  });
};

const getCitationAlert = () => {
  return getActiveCitationTabpanel().querySelector('.actions__alert');
};

const getCitationInput = () => {
  return getActiveCitationTabpanel().querySelector('.citation__input');
};

export { getActiveCitationTabpanel, getCitationAlert, getCitationInput };
