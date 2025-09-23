import toggleBanner from './_go-to.js';

const listName = 'temporaryList';

const setTemporaryList = (list) => {
  sessionStorage.setItem(listName, JSON.stringify(list));
};

const getTemporaryList = () => {
  // Retrieve the temporary list from session storage, or return a prefilled object if it doesn't exist
  return JSON.parse(sessionStorage.getItem(listName))
    || {
      articles: {},
      catalog: {},
      databases: {},
      guidesandmore: {},
      onlinejournals: {}
    };
};

const inTemporaryList = ({ recordDatastore, recordId }) => {
  const list = getTemporaryList();
  // Check if the datastore is in the list and if the recordId exists within that datastore
  return recordDatastore in list && recordId in list[recordDatastore];
};

const updateResultUI = (form) => {
  // Check if the record is already in the list
  const { recordDatastore, recordId } = form.dataset;
  const isAdded = inTemporaryList({ recordDatastore, recordId });
  // Update the container class
  const container = document.querySelector(`.record__container[data-record-id="${recordId}"][data-record-datastore="${recordDatastore}"]`);
  container.classList.toggle('record__container--active', isAdded);
  // Update the button class
  const button = form.querySelector('button');
  button.classList.toggle('button__ghost--active', isAdded);
  // Update the button text
  const buttonTitle = button.getAttribute('title').replace(/Add to|Remove from/u, isAdded ? 'Remove from' : 'Add to');
  button.setAttribute('title', buttonTitle);
  const [buttonIcon, buttonText] = button.querySelectorAll('span');
  buttonIcon.textContent = isAdded ? 'delete' : 'add';
  buttonText.textContent = buttonText.textContent
    .replace(/Add|Remove/u, isAdded ? 'Remove' : 'Add')
    .replace(/to My Temporary List|from My Temporary List/u, isAdded ? 'from My Temporary List' : 'to My Temporary List');
  // Toggle the banner
  toggleBanner(Object.keys(getTemporaryList()).length);
};

const handleFormSubmit = async (event) => {
  const form = event.target;

  if (!form.matches('.list__add-to')) {
    return;
  }

  event.preventDefault();

  const { recordDatastore, recordId } = form.dataset;
  const list = getTemporaryList();

  if (inTemporaryList({ recordDatastore, recordId })) {
    // If the record is already in the list, remove it
    delete list[recordDatastore][recordId];
  } else {
    try {
      const response = await fetch(form.getAttribute('action'));
      if (!response.ok) {
        // Do not add to the list if the fetch fails
        return;
      }
      // Add the record information to the list
      const data = await response.json();
      list[recordDatastore][recordId] = data;
    } catch {
      // Silent failure, so no action is needed
      return;
    }
  }

  setTemporaryList(list);
  updateResultUI(form);
};

const addToList = (updateResult = updateResultUI) => {
  document.body.addEventListener('submit', handleFormSubmit);

  // Initial UI update for all buttons
  const forms = document.querySelectorAll('.list__add-to');
  forms.forEach((form) => {
    // `updateResult` is passed in for testing purposes
    updateResult(form);
  });
};

export { addToList, getTemporaryList, handleFormSubmit, inTemporaryList, setTemporaryList, updateResultUI };
