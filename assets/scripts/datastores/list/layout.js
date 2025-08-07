import changeCount from './partials/_in-list.js';
import { getTemporaryList } from './partials/_add-to.js';
import listItem from './partials/_list-item.js';

const temporaryList = () => {
  const list = getTemporaryList();
  const recordIds = Object.keys(list);
  const listCount = recordIds.length;
  const emptyList = document.querySelector('.list__empty');

  // Update in list count
  changeCount(listCount);

  // Toggle empty message
  if (listCount) {
    emptyList.style.display = 'none';
  } else {
    emptyList.removeAttribute('style');
  }

  // Create temporary list
  const listItems = document.createElement('ol');
  listItems.className = 'list__items list__no-style';
  const listContainer = document.querySelector('.list');
  listContainer.appendChild(listItems);

  // Display records
  recordIds.forEach((recordId, index) => {
    listItems.appendChild(listItem({ index, record: list[recordId], recordId }));
  });
};

export default temporaryList;
