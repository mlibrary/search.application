const viewingFullRecord = () => {
  return window.location.pathname.includes('/record/');
};

const getRecordData = ({ record = document.querySelector('.record__container') } = {}) => {
  const { recordDatastore, recordId } = record.dataset;

  return { recordDatastore, recordId };
};

const toggleContainerClass = ({ isAdded, recordDatastore, recordId }) => {
  const container = document.querySelector(`.record__container[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);
  container.classList.toggle('record__container--active', isAdded);
};

export { getRecordData, toggleContainerClass, viewingFullRecord };
