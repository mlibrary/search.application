/*
  - [x] List has data-current-page=0
  - [x] List item has data-page= -1/0/1
  - [x] Clicking on move(-1) will change data-current-page=-1
  - [x] All list items of data-page=-1 will display and the rest will not
  - [x] Set data-current-page=0 on resize
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

const getElements = () => {
  const shelfBrowseContainer = document.querySelector('.shelf-browse');

  // Buttons
  const previousButton = shelfBrowseContainer.querySelector('button.shelf-browse__carousel--button-previous');
  const nextButton = shelfBrowseContainer.querySelector('button.shelf-browse__carousel--button-next');
  const returnButton = shelfBrowseContainer.querySelector('button.shelf-browse__return');

  // List
  const list = shelfBrowseContainer.querySelector('.shelf-browse__carousel--items');
  const items = list.querySelectorAll('li');

  return {
    items,
    list,
    nextButton,
    previousButton,
    returnButton
  };
};

const setPageNumbers = () => {
  const { items, list } = getElements();

  // Find where the current record is located in the list
  const currentRecordIndex = Array.from(items).findIndex((item) => {
    return item.classList.contains('current-record');
  });
  const itemCount = pageLimit();
  const difference = Math.floor(itemCount / 2);

  // Reset data attributes
  items.forEach((item) => {
    return item.removeAttribute('data-page');
  });
  list.setAttribute('data-current-page', 0);

  // Define the items to show on the default page
  for (let index = currentRecordIndex - difference; index <= (currentRecordIndex + difference); index += 1) {
    items[index].setAttribute('data-page', 0);
  }

  // Loop through each previous item starting from the current record
  let previousCount = -1;
  let previousDataPage = -1;
  for (let index = currentRecordIndex - (difference + 1); index >= 0; index -= 1) {
    // Decrease page count for every number of records
    previousCount += 1;
    if (previousCount === itemCount) {
      previousCount = 0;
      previousDataPage -= 1;
    }
    // Set calculated page number
    items[index].setAttribute('data-page', previousDataPage);
  }

  // Loop through each next item starting from the current record
  let nextCount = -1;
  let nextDataPage = 1;
  for (let index = currentRecordIndex + (difference + 1); index < items.length; index += 1) {
    // Increase page count for every number of records
    nextCount += 1;
    if (nextCount === itemCount) {
      nextCount = 0;
      nextDataPage += 1;
    }
    // Set calculated page number
    items[index].setAttribute('data-page', nextDataPage);
  }
};

const move = (direction) => {
  // Direction must be a number
  if (typeof direction !== 'number') {
    return;
  }

  // Get list and items
  const { items, list } = getElements();

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
  const { nextButton, previousButton, returnButton } = getElements();

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
  const { list, nextButton, previousButton, returnButton } = getElements();

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
    const currentPage = Number(list.getAttribute('data-current-page'));
    // Convert to a positive or negative value to move to page 0
    return move(-currentPage);
  });
};

export default shelfBrowse;
