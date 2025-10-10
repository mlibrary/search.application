const getActiveCitationTab = () => {
  return document.querySelector('.citation .citation__tablist[role="tablist"] [role="tab"][aria-selected="true"]');
};

export { getActiveCitationTab };
