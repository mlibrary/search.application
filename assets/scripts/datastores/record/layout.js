import { inTemporaryList } from '../partials/actions/action/_my-temporary-list.js';

const viewingFullRecord = () => {
  // Check if the current pathname includes '/record/'
  return window.location.pathname.includes('/record/');
};

const toggleContainerClass = ({ isAdded, recordDatastore, recordId }) => {
  const container = document.querySelector(`.record__container[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);
  container.classList.toggle('record__container--active', isAdded);
};

const getRecords = () => {
  return document.querySelectorAll('[data-record-id][data-record-datastore]');
};

const checkRecordsInList = ({ inList = inTemporaryList, list, records = getRecords() }) => {
  records.forEach((record) => {
    const [recordId, recordDatastore] = [record.getAttribute('data-record-id'), record.getAttribute('data-record-datastore')];
    const isInList = inList({ list, recordDatastore, recordId });
    record.classList.toggle('record__container--active', isInList);
    // If has checkbox, check it
    const checkbox = record.querySelector('input[type="checkbox"].list__item--checkbox');
    if (checkbox) {
      checkbox.checked = isInList;
    }
  });
};

const fullRecordFuncs = {
  checkRecordsInList
};

const initializeFullRecord = ({ list, recordFuncs = fullRecordFuncs }) => {
  recordFuncs.checkRecordsInList({ list });
};

export { getRecords, initializeFullRecord, toggleContainerClass, viewingFullRecord };
