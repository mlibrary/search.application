const viewingFullRecord = () => {
  return window.location.pathname.includes('/record/');
};

const toggleContainerClass = ({ isAdded, recordDatastore, recordId }) => {
  const container = document.querySelector(`.record__container[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);
  container.classList.toggle('record__container--active', isAdded);
};

export { toggleContainerClass, viewingFullRecord };
