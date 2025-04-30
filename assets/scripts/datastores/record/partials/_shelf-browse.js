/*
  - [x] List has data-current-page=0
  - [x] List item has data-page= -1/0/1
  - [x] Clicking on move(-1) will change data-current-page=-1
  - [x] All list items of data-page=-1 will display and the rest will not
  - [x] Set data-current-page=0 on resize
  - [x] Apply animations on previous/next click
  - [] Change pagination button titles on resize
  - [] Update UI of first and last cards
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

  // Current Record
  const currentRecordIndex = Array.from(items).findIndex((item) => {
    return item.classList.contains('current-record');
  });

  // Directions
  const directions = {
    next: 1,
    previous: -1
  };

  return {
    currentRecordIndex,
    directions,
    items,
    list,
    nextButton,
    previousButton,
    returnButton
  };
};

const setPageNumbers = () => {
  const { currentRecordIndex, directions, items, list } = getElements();

  // Find the difference of the current page count
  const itemCount = pageLimit();
  const difference = Math.floor(itemCount / 2);

  // Reset data attributes
  items.forEach((item) => {
    return item.removeAttribute('data-page');
  });
  list.setAttribute('data-current-page', 0);

  // Define the items to show on the default page
  const start = currentRecordIndex - difference;
  const end = currentRecordIndex + difference;
  for (let index = start; index <= end; index += 1) {
    items[index].setAttribute('data-page', 0);
  }

  // Loop through each item, depending on the direction
  Object.keys(directions).forEach((direction) => {
    const movePage = directions[direction];

    const startIndex = currentRecordIndex + (Math.ceil(itemCount / 2) * movePage);
    const endIndex = movePage < 0 ? movePage : items.length;
    const step = movePage;

    let page = movePage;
    let count = 0;

    // Loop through items, adjusting index by movePage
    for (let index = startIndex; index !== endIndex; index += step) {
      // Assign current page number to the item's data-page attribute
      items[index].setAttribute('data-page', page);

      // Break the loop if page increment condition is met
      count += 1;
      if (count === itemCount) {
        count = 0;
        page += movePage;
      }
    }
  });
};

const filteredItems = ({ items, page }) => {
  return Array.from(items).filter((item) => {
    return item.getAttribute('data-page') === page;
  });
};

const move = (direction) => {
  // Direction must be a number
  if (typeof direction !== 'number') {
    return;
  }

  // Get list and items
  const { items, list } = getElements();

  // Set current page
  const priorPage = list.getAttribute('data-current-page');
  list.setAttribute('data-current-page', Number(list.getAttribute('data-current-page')) + direction);
  const currentPage = list.getAttribute('data-current-page');
  const priorItems = filteredItems({ items, page: priorPage });
  const currentItems = filteredItems({ items, page: currentPage });
  // 0.25s animation duration according to assets/styles/datastores/record/partials/_shelf-browse.scss
  const animationDuration = 250;

  // Toggle display on load
  if (direction === 0) {
    items.forEach((item) => {
      if (item.getAttribute('data-page') === currentPage) {
        item.removeAttribute('style');
      } else {
        item.style.display = 'none';
      }
    });
  } else {
    const way = direction > 0 ? 'next' : 'previous';
    // Apply class to prior items, then hide
    const priorClass = `animation-out-${way}`;
    priorItems.forEach((item) => {
      item.classList.add(priorClass);
      setTimeout(() => {
        item.classList.remove(priorClass);
        item.style.display = 'none';
      }, animationDuration);
    });
    // Display current items, then add class
    const currentClass = `animation-in-${way}`;
    currentItems.forEach((item) => {
      setTimeout(() => {
        item.removeAttribute('style');
        item.classList.add(currentClass);
      }, animationDuration);
      setTimeout(() => {
        item.classList.remove(currentClass);
      }, (animationDuration * 2));
    });
  }

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

const returnToCurrentRecord = () => {
  const { list } = getElements();
  // Get current page value
  const currentPage = Number(list.getAttribute('data-current-page'));
  // Convert to a positive or negative value to move to page 0
  return move(-currentPage);
};

const shelfBrowse = () => {
  // Get elements
  const { directions, nextButton, previousButton, returnButton } = getElements();

  // Set page numbers
  setPageNumbers();
  // Reset and recalculate pages on resize
  window.addEventListener('resize', () => {
    returnToCurrentRecord();
    return setPageNumbers();
  });

  // Toggle items on load
  move(0);

  // Previous page
  previousButton.addEventListener('click', () => {
    return move(directions.previous);
  });

  // Next page
  nextButton.addEventListener('click', () => {
    return move(directions.next);
  });

  // Return button
  returnButton.addEventListener('click', () => {
    returnToCurrentRecord();
  });
};

export default shelfBrowse;
