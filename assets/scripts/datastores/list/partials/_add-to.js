import toggleBanner from './_go-to.js';

const getTemporaryList = () => {
  // Retrieve the temporary list from session storage, or return an empty object if it doesn't exist
  return JSON.parse(sessionStorage.getItem('temporaryList')) || {};
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

const addToList = () => {
  // Get the temporary list from session storage
  const list = getTemporaryList();
  // Select all forms with the class 'list__add-to'
  const forms = document.querySelectorAll('.list__add-to');
  forms.forEach((form) => {
    // Get the action URL
    const fetchUrl = form.action;
    // Extract the record ID from the URL
    const recordId = fetchUrl.split('/').pop();
    // Get the button within the form
    const button = form.querySelector('button');
    // Update the button UI on load
    updateResultUI({ button, recordId });
    form.addEventListener('submit', (event) => {
      // Prevent the default form submission
      event.preventDefault();
      if (recordId in list) {
        // If the record is already in the list, remove it
        delete list[recordId];
      } else {
        // If the record is not in the list, add it
        list[recordId] = {
          datastore: 'catalog',
          metadata: [
            {
              data: {
                original: '',
                transliterated: null
              },
              field: 'Main Author'
            },
            {
              data: {
                original: '',
                transliterated: null
              },
              field: 'Published/Created'
            },
            {
              data: {
                original: '',
                transliterated: null
              },
              field: 'Series'
            }
          ],
          title: {
            original: '',
            transliterated: null
          },
          url: null
        };
        // TO DO: Fetch the action URL to get the record metadata
      }
      // Update the session storage with the modified list
      sessionStorage.setItem('temporaryList', JSON.stringify(list));
      // Update the button UI again
      updateResultUI({ button, recordId });
    });
  });
};

export { addToList, getTemporaryList, updateResultUI };
