const storageName = 'datastoreInfo';

const defaultDatastoreInfo = {
  articles: false,
  catalog: false,
  databases: false,
  everything: false,
  guidesandmore: false,
  onlinejournals: false
};

const getInfoStorage = () => {
  try {
    // Get session storage
    const item = sessionStorage.getItem(storageName);
    // Throw if `item` is falsy, or returned problematic string values
    if (!item || ['undefined', 'null'].includes(item)) {
      throw new Error('Invalid `sessionStorage` value');
    }
    // Parse and return the list
    return JSON.parse(item);
  } catch {
    // Return the default list if there are any issues with session storage
    return defaultDatastoreInfo;
  }
};

const setInfoStorage = (infoList) => {
  sessionStorage.setItem(storageName, JSON.stringify(infoList));
};


const toggleInfoSection = ({ infoSection, isAdded }) => {
  infoSection.classList.toggle('results__info--hidden', isAdded);
};

const hideButton = () => {
  return document.querySelector('.results__info--hide');
};

const hideInfo = ({ button = hideButton(), list = getInfoStorage() } = {}) => {
  const infoSection = document.getElementById(button.getAttribute('aria-controls'));
  const datastore = infoSection.dataset.datastore;
  const updatedList = { ...list };
  toggleInfoSection({ infoSection, isAdded: updatedList[datastore] });
  button.addEventListener('click', () => {
    updatedList[datastore] = !updatedList[datastore];
    setInfoStorage(updatedList);
    toggleInfoSection({ infoSection, isAdded: updatedList[datastore] });
  });
};

export { hideInfo };
