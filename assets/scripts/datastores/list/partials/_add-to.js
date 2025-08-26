import toggleBanner from './_go-to.js';

const listName = 'temporaryList';

const setTemporaryList = (list) => {
  sessionStorage.setItem(listName, JSON.stringify(list));
};

const getTemporaryList = () => {
  // Retrieve the temporary list from session storage, or return an empty object if it doesn't exist
  return JSON.parse(sessionStorage.getItem(listName)) || {};
};

const updateResultUI = ({ button, recordId }) => {
  // Get the current temporary list from session storage
  const list = getTemporaryList();
  // Check if the record is already in the list
  const isAdded = recordId in list;
  // Update the container class
  const container = document.querySelector(`[data-record-id="${recordId}"]`);
  container.classList.toggle('record__container--active', isAdded);
  // Update the button class
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
  toggleBanner(Object.keys(list).length);
};

const handleFormSubmit = async (event) => {
  const form = event.target;

  if (!form.matches('.list__add-to')) {
    return;
  }

  event.preventDefault();

  const recordId = form.getAttribute('data-record-id');
  const list = getTemporaryList();

  if (recordId in list) {
    // If the record is already in the list, remove it
    delete list[recordId];
  } else {
    try {
      const response = await fetch(form.getAttribute('action'));
      if (!response.ok) {
        // Do not add to the list if the fetch fails
        return;
      }
      // Add the record information to the list
      const data = await response.json();
      list[recordId] = data;
    } catch {
      // Silent failure, so no action is needed
      return;
    }
  }

  setTemporaryList(list);
  updateResultUI({ button: form.querySelector('button'), recordId });
};

const addToList = () => {
  document.body.addEventListener('submit', handleFormSubmit);

  // Initial UI update for all buttons
  const forms = document.querySelectorAll('.list__add-to');
  forms.forEach((form) => {
    const recordId = form.getAttribute('data-record-id');
    const button = form.querySelector('button');
    updateResultUI({ button, recordId });
  });
};

export { addToList, getTemporaryList, handleFormSubmit, setTemporaryList, updateResultUI };
