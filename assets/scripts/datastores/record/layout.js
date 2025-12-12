const toggleContainerClass = ({ isAdded, recordDatastore, recordId }) => {
  const container = document.querySelector(`.record__container[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);
  container.classList.toggle('record__container--active', isAdded);
};

export default toggleContainerClass;
