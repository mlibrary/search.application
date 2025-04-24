const shelfBrowse = () => {
  const paginationNumbers = document.getElementById('pagination-numbers');
  const paginatedList = document.getElementById('paginated-list');
  const listItems = paginatedList.querySelectorAll('li');
  const nextButton = document.getElementById('next-button');
  const prevButton = document.getElementById('prev-button');

  const paginationLimit = 5;
  const pageCount = Math.ceil(listItems.length / paginationLimit);
  let currentPage = 1;

  const handlePageButtonsStatus = () => {
    // Disabled previous button if on the first page
    prevButton.toggleAttribute('disabled', currentPage === 1);
    // Disabled next button if on the last page
    nextButton.toggleAttribute('disabled', pageCount === currentPage);
  };

  const handleActivePageNumber = () => {
    document.querySelectorAll('.pagination-number').forEach((button) => {
      button.classList.remove('button__ghost');
      const pageIndex = Number(button.getAttribute('page-index'));
      if (pageIndex === currentPage) {
        button.classList.add('button__ghost');
      }
    });
  };

  const appendPageNumber = (index) => {
    const pageNumber = document.createElement('button');
    pageNumber.className = 'pagination-number';
    pageNumber.innerHTML = index;
    pageNumber.setAttribute('page-index', index);
    pageNumber.setAttribute('aria-label', `Page ${index}`);

    paginationNumbers.appendChild(pageNumber);
  };

  const getPaginationNumbers = () => {
    // eslint-disable-next-line no-plusplus
    for (let index = 1; index <= pageCount; index++) {
      appendPageNumber(index);
    }
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    handleActivePageNumber();
    handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
      item.classList.add('hidden');
      if (index >= prevRange && index < currRange) {
        item.classList.remove('hidden');
      }
    });
  };

  window.addEventListener('load', () => {
    getPaginationNumbers();
    setCurrentPage(1);

    prevButton.addEventListener('click', () => {
      setCurrentPage(currentPage - 1);
    });

    nextButton.addEventListener('click', () => {
      setCurrentPage(currentPage + 1);
    });

    document.querySelectorAll('.pagination-number').forEach((button) => {
      const pageIndex = Number(button.getAttribute('page-index'));

      if (pageIndex) {
        button.addEventListener('click', () => {
          setCurrentPage(pageIndex);
        });
      }
    });
  });
};

export default shelfBrowse;
