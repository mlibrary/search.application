import { getSessionStorage, setSessionStorage } from '../../list/layout.js';

const itemName = 'datastoreInfo';

const defaultValue = {
  articles: false,
  catalog: false,
  databases: false,
  everything: false,
  guidesandmore: false,
  onlinejournals: false
};

const hideInfoButton = () => {
  return document.querySelector('.results__info--hide');
};

const toggleInfoSectionClass = ({ infoSection, isAdded }) => {
  infoSection.classList.toggle('results__info--hidden', isAdded);
};

const hideInfo = ({
  button = hideInfoButton(),
  list = getSessionStorage({ defaultValue, itemName }),
  setInfoSection = setSessionStorage,
  toggleInfoSection = toggleInfoSectionClass
} = {}) => {
  // Get the parent info section
  const infoSection = button.parentElement;
  // Get the datastore from the data attribute
  const { datastore } = infoSection.dataset;
  // Create a copy of the list to modify
  const updatedList = { ...list };

  // Toggle the info section visibility based on stored value
  toggleInfoSection({ infoSection, isAdded: updatedList[datastore] });

  // Add event listener to the button to toggle the info section
  button.addEventListener('click', () => {
    // Toggle the value for the datastore
    updatedList[datastore] = !updatedList[datastore];

    // Save the updated list to session storage
    setInfoSection({ itemName, value: updatedList });
    // Toggle the info section visibility
    toggleInfoSection({ infoSection, isAdded: updatedList[datastore] });
  });
};

export {
  hideInfoButton,
  hideInfo,
  toggleInfoSectionClass
};
