import { getTemporaryList } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';

const changeCount = () => {
  // Get the count element
  const countElement = document.querySelector('.list__in-list span.strong');

  // Update the count based on the length of the temporary list
  countElement.textContent = Object.keys(getTemporaryList()).length;
};

export default changeCount;
