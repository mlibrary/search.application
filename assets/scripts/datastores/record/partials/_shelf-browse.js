/*
  - [x] List has data-current-page=0
  - [x] List item has data-page= -1/0/1
  - [x] Clicking on move(-1) will change data-current-page=-1
  - [x] All list items of data-page=-1 will display and the rest will not
  - [] Set data-current-page=0 on resize
  - [] Apply animations on previous/next click
  - [] Change pagination button titles on resize
*/

const pageLimit = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth >= 820) {
    return 5;
  } else if (screenWidth >= 640) {
    return 3;
  }
  return 1;
};

const getButtons = () => {
  const shelfBrowseContainer = document.querySelector('.shelf-browse');
  const previousButton = shelfBrowseContainer.querySelector('button.shelf-browse__carousel--button-previous');
  const nextButton = shelfBrowseContainer.querySelector('button.shelf-browse__carousel--button-next');
  const returnButton = shelfBrowseContainer.querySelector('button.shelf-browse__return');

  return {
    nextButton,
    previousButton,
    returnButton
  };
};

const setPageNumbers = () => {
  const shelfBrowseContainer = document.querySelector('.shelf-browse');
  const list = shelfBrowseContainer.querySelector('.shelf-browse__carousel--items');
  const items = list.querySelectorAll('li');
  // Default value in case the class is not found
  let currentIndex = -1;
  const itemCount = pageLimit();

  // Store the index of the matching item
  items.forEach((item, index) => {
    if (item.classList.contains('current-record')) {
      currentIndex = index;
    }
  });

  // Define the previous items to show on the default page
  for (let index = currentIndex + 1; index < (currentIndex + Math.ceil(itemCount / 2)); index++) {
    items[index].setAttribute('data-page', 0);
  }

  // Loop through each list item starting from index 22
  for (let index = currentIndex - Math.ceil(itemCount / 2); index >= 0; index--) {
    // Calculate the current page number based on position
    const currentPage = (Math.floor(index / itemCount) + 1) - itemCount;
    items[index].setAttribute('data-page', currentPage);
  }

  // Define the next items to show on the default page
  for (let index = currentIndex - Math.floor(itemCount / 2); index < currentIndex; index++) {
    items[index].setAttribute('data-page', 0);
  }

  // Loop through each list item starting from index 22
  for (let index = currentIndex + Math.ceil(itemCount / 2); index < items.length; index++) {
    // Calculate the current page number based on position
    const currentPage = (Math.floor(index / itemCount) + 1) - itemCount;
    items[index].setAttribute('data-page', currentPage);
  }
};

const move = (direction) => {
  // Direction must be a number
  if (typeof direction !== 'number') {
    return;
  }

  // Get list and items
  const shelfBrowseContainer = document.querySelector('.shelf-browse');
  const list = shelfBrowseContainer.querySelector('.shelf-browse__carousel--items');
  const items = list.querySelectorAll('li');

  // Set current page
  list.setAttribute('data-current-page', Number(list.getAttribute('data-current-page')) + direction);
  const currentPage = list.getAttribute('data-current-page');

  // Toggle list items
  items.forEach((item) => {
    if (item.getAttribute('data-page') === currentPage) {
      item.removeAttribute('style');
    } else {
      item.style.display = 'none';
    }
  });

  // Toggle disabled buttons
  const { nextButton, previousButton, returnButton } = getButtons();

  // Disable return button if on starting page
  returnButton.toggleAttribute('disabled', currentPage === '0');

  // Get array of pages
  const dataPageValues = Array.from(items, (item) => {
    return item.getAttribute('data-page');
  });
  const pages = [...new Set(dataPageValues)];

  // Disable previous button if on first page
  previousButton.toggleAttribute('disabled', currentPage === pages[0]);

  // Disable next button if on last page
  nextButton.toggleAttribute('disabled', currentPage === pages[pages.length - 1]);
};

const shelfBrowse = () => {
  // Set page numbers
  setPageNumbers();

  // Toggle items on load
  move(0);

  // Get buttons
  const shelfBrowseContainer = document.querySelector('.shelf-browse');
  const { nextButton, previousButton, returnButton } = getButtons();

  // Previous page
  previousButton.addEventListener('click', () => {
    return move(-1);
  });

  // Next page
  nextButton.addEventListener('click', () => {
    return move(1);
  });

  // Return button
  returnButton.addEventListener('click', () => {
    // Get current page value
    const items = shelfBrowseContainer.querySelector('.shelf-browse__carousel--items');
    const currentPage = Number(items.getAttribute('data-current-page'));
    // Convert to a positive or negative value to move to page 0
    return move(-currentPage);
  });
};

export default shelfBrowse;
