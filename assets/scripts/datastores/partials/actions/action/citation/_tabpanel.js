const getActiveCitationTabpanel = () => {
  const tabpanels = document.querySelectorAll('.citation [role="tabpanel"]');
  return Array.from(tabpanels).find((tabpanel) => {
    return tabpanel.style.display !== 'none';
  });
};

export { getActiveCitationTabpanel };
