const getElements = () => {
  const shelfBrowseContainer = document.querySelector('.shelf-browse');
  const selectors = {
    list: '.shelf-browse__carousel--items',
    nextButton: 'button.shelf-browse__carousel--button-next',
    previousButton: 'button.shelf-browse__carousel--button-previous',
    returnButton: 'button.shelf-browse__return'
  };

  const elements = Object.fromEntries(
    Object.entries(selectors).map(([key, selector]) => {
      return [key, shelfBrowseContainer.querySelector(selector)];
    })
  );

  return {
    ...elements,
    directions: { next: 1, previous: -1 },
    items: elements.list.querySelectorAll('li')
  };
};

const setPageNumbers = () => {
  const { directions, items, list } = getElements();

  // Set the item count based on 'xs' and 'sm' breakpoints found in `./assets/styles/_media.scss`
  let itemCount = 1;
  if (window.innerWidth >= 820) {
    itemCount = 5;
  } else if (window.innerWidth >= 640) {
    itemCount = 3;
  }

  // Get the position of the current record
  const currentRecordIndex = Array.from(items).findIndex((item) => {
    return item.classList.contains('current-record');
  });

  // Calculate the difference
  const difference = Math.floor(itemCount / 2);

  // Initialize items for current page
  list.setAttribute('data-current-page', 0);
  items.forEach((item, index) => {
    item.removeAttribute('data-page');
    if (index >= (currentRecordIndex - difference) && index <= (currentRecordIndex + difference)) {
      items[index].setAttribute('data-page', 0);
      item.removeAttribute('style');
    } else {
      item.style.display = 'none';
    }
  });

  // Loop through each item, depending on the direction
  Object.keys(directions).forEach((direction) => {
    const movePage = directions[direction];
    let page = movePage;
    let count = 0;
    const startIndex = currentRecordIndex + (Math.ceil(itemCount / 2) * movePage);

    // Set up pagination
    for (let index = startIndex; index >= 0 && index < items.length; index += movePage) {
      items[index].setAttribute('data-page', page);
      count += 1;
      // Break the loop if page increment condition is met
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
  const { items, list, nextButton, previousButton, returnButton } = getElements();

  // Get prior
  const priorPage = list.getAttribute('data-current-page');
  const priorItems = filteredItems({ items, page: priorPage });

  // Set current
  list.setAttribute('data-current-page', Number(list.getAttribute('data-current-page')) + direction);
  const currentPage = list.getAttribute('data-current-page');
  const currentItems = filteredItems({ items, page: currentPage });

  // 0.25s animation duration according to `./assets/styles/datastores/record/partials/_shelf-browse.scss`
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

  // Disable return button if on starting page
  returnButton.toggleAttribute('disabled', currentPage === '0');

  // Update previous button hidden text
  const previousPageItems = filteredItems({ items, page: String(Number(currentPage) - 1) }).length;
  previousButton.querySelector('.visually-hidden').textContent = `Previous ${previousPageItems} record${previousPageItems === 1 ? '' : 's'}`;
  // Disable previous button if on first page
  previousButton.toggleAttribute('disabled', currentPage === items[0].getAttribute('data-page'));

  // Update next button hidden text
  const nextPageItems = filteredItems({ items, page: String(Number(currentPage) + 1) }).length;
  nextButton.querySelector('.visually-hidden').textContent = `Next ${nextPageItems} record${previousPageItems === 1 ? '' : 's'}`;
  // Disable next button if on last page
  nextButton.toggleAttribute('disabled', currentPage === items[items.length - 1].getAttribute('data-page'));
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

  // Initialize carousel records
  setPageNumbers();
  move(0);

  // Reset and recalculate pages on resize
  window.addEventListener('resize', () => {
    returnToCurrentRecord();
    setPageNumbers();
  });

  // Previous page
  previousButton.addEventListener('click', () => {
    move(directions.previous);
  });

  // Next page
  nextButton.addEventListener('click', () => {
    move(directions.next);
  });

  // Return button
  returnButton.addEventListener('click', () => {
    returnToCurrentRecord();
  });
};

export default shelfBrowse;
