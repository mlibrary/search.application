import { expect } from 'chai';
import shelfBrowse from '../../../../../assets/scripts/datastores/record/partials/_shelf-browse.js';
import sinon from 'sinon';

describe('shelfBrowse', function () {
  const innerHTML = `
      <div class="shelf-browse">
        <button class="shelf-browse__carousel--button-previous">
          <span class="visually-hidden">Previous 5 records</span>
        </button>
        <ul class="shelf-browse__carousel--items">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li class="current-record"></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <button class="shelf-browse__carousel--button-next">
          <span class="visually-hidden">Next 5 records</span>
        </button>
        <button class="shelf-browse__return" disabled>
          Return to current record
        </button>
      </div>
    `;
  let getPreviousButton = null;
  let getList = null;
  let getDataCurrentPage = null;
  let getItems = null;
  let getNextButton = null;
  let getCurrentRecord = null;
  let fastForwardTime = null;
  let getCurrentRecordButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = innerHTML;

    getPreviousButton = () => {
      return document.querySelector('button.shelf-browse__carousel--button-previous');
    };

    getList = () => {
      return document.querySelector('.shelf-browse__carousel--items');
    };

    getDataCurrentPage = (number = false) => {
      const value = getList().getAttribute('data-current-page');
      return number ? Number(value) : value;
    };

    getItems = () => {
      return document.querySelectorAll('.shelf-browse__carousel--items > li');
    };

    getNextButton = () => {
      return document.querySelector('button.shelf-browse__carousel--button-next');
    };

    getCurrentRecord = () => {
      return document.querySelector('.current-record');
    };

    const clock = sinon.useFakeTimers();
    fastForwardTime = (time = 250) => {
      return clock.tick(time);
    };

    getCurrentRecordButton = () => {
      return document.querySelector('button.shelf-browse__return');
    };
  });

  afterEach(function () {
    getPreviousButton = null;
    getList = null;
    getDataCurrentPage = null;
    getItems = null;
    getNextButton = null;
    getCurrentRecord = null;
    fastForwardTime = null;
    getCurrentRecordButton = null;
  });

  describe('setPageNumbers()', function () {
    it('sets `data-current-page`', function () {
      // Check that the carousel does not have `data-current-page` set
      expect(getList().hasAttribute('data-current-page'), '`data-current-page` should not be set').to.be.false;

      // Call the function
      shelfBrowse();

      // Check that the carousel has `data-current-page` set to `0`
      expect(getDataCurrentPage(), '`data-current-page` should be set to `0`').to.equal('0');
    });

    it('sets `data-page` on all list items', function () {
      // Check that all list items has the attribute `data-page`
      const listItems = () => {
        return Array.from(getItems()).every((item) => {
          return item.hasAttribute('data-page');
        });
      };

      // Check that all list items do not have `data-page` set
      expect(listItems(), 'list items should not have `data-page` set').to.be.false;

      // Call the function
      shelfBrowse();

      // Check that all list items do have `data-page` set
      expect(listItems(), 'list items should have `data-page` defined').to.be.true;
    });

    it('should set `data-page` of `.current-record` to `0`', function () {
      // Check that `.current-record` does not have `data-page` set
      expect(getCurrentRecord().hasAttribute('data-page'), '`.current-record` should not have `data-page` set').to.be.false;

      // Call the function
      shelfBrowse();

      // Check that `.current-record` has `data-page` set to `0`
      expect(getCurrentRecord().getAttribute('data-page'), '`.current-record` should have `data-page` set to `0`').to.equal('0');
    });

    it('should set `data-page` of list items prior to `.current-record` be less than `0`', function () {
      // Call the function
      shelfBrowse();

      // Check the `data-page` value of the first item
      const firstPage = Number(getItems()[0].getAttribute('data-page'));
      expect(firstPage, 'the `data-page` value of the first item should be less than the value of the current record').to.be.lessThan(Number(getCurrentRecord().getAttribute('data-page')));
    });

    it('should set `data-page` of list items after `.current-record` be more than `0`', function () {
      // Call the function
      shelfBrowse();

      // Check the `data-page` value of the last item
      const lastPage = Number(getItems()[getItems().length - 1].getAttribute('data-page'));
      expect(lastPage, 'the `data-page` value of the last item should be more than the value of the current record').to.be.greaterThan(Number(getCurrentRecord().getAttribute('data-page')));
    });

    it('should hide all list items that are not on page 0', function () {
      // Call the function
      shelfBrowse();

      // Check that all items with `data-page="0"` are displaying
      expect(Array.from(getItems()).filter((item) => {
        return item.getAttribute('data-page') === '0';
      }).every((item) => {
        return !item.hasAttribute('style');
      }), 'all items with `data-page="0"` should not have a `style` attribute').to.be.true;

      // Check that all items that don't have `data-page="0"` are hidden
      expect(Array.from(getItems()).filter((item) => {
        return item.getAttribute('data-page') !== '0';
      }).every((item) => {
        return item.getAttribute('style') === 'display: none;';
      }), 'all items whose attribute `data-page` does not equal `0` should be hidden').to.be.true;
    });

    it('should define the page difference', function () {
      // Call the function
      shelfBrowse();

      // Check that the `data-first-page-difference` attribute is set
      expect(getList().hasAttribute('data-first-page-difference'), '`data-first-page-difference` should be set').to.be.true;

      // Check that the `data-first-page-difference` attribute is set to `2`
      expect(getList().getAttribute('data-first-page-difference'), '`data-first-page-difference` should be set to `1`').to.equal('1');
    });
  });

  describe('previous records', function () {
    beforeEach(function () {
      // Call the function
      shelfBrowse();
    });

    it('should update the `data-current-page` attribute to be one less than the prior value', function () {
      // Get the `data-current-page` value before clicking the previous button
      const priorDataCurrentPage = getDataCurrentPage(true);

      // Click the previous button
      getPreviousButton().click();

      // Get expected page number
      const expectedPage = priorDataCurrentPage - 1;

      // Check that the carousel has `data-current-page` set to `-1`
      expect(getDataCurrentPage(true), `\`data-current-page\` should be set to \`${expectedPage}\``).to.equal(expectedPage);
    });

    it('should set animation classes', function () {
      // Get page items
      const getPageItems = () => {
        return Array.from(getItems()).filter((item) => {
          return item.getAttribute('data-page') === getDataCurrentPage();
        });
      };

      // Get the prior items
      const priorItems = getPageItems();

      // Click the previous button
      getPreviousButton().click();

      // Check that the prior items have an animation class
      expect(priorItems.every((item) => {
        return item.classList.contains('animation-out-previous');
      }), 'prior items should all have the `animation-out-previous` class').to.be.true;

      // Fast forward time
      fastForwardTime();

      // Check that the current items have an animation class
      expect(getPageItems().every((item) => {
        return item.classList.contains('animation-in-previous');
      }), 'current items should all have the `animation-in-previous` class').to.be.true;
    });

    it('should change visibility of records', function () {
      // Get page items
      const getPageItems = () => {
        return Array.from(getItems()).filter((item) => {
          return item.getAttribute('data-page') === getDataCurrentPage();
        });
      };

      // Get the prior items
      const priorItems = getPageItems();

      // Click the previous button
      getPreviousButton().click();

      // Check that the prior items are visible
      expect(priorItems.every((item) => {
        return !item.hasAttribute('style');
      }), 'prior items should still be visible').to.be.true;

      // Fast forward time
      fastForwardTime();

      // Check that the prior items are hidden
      expect(priorItems.every((item) => {
        return item.getAttribute('style') === 'display: none;';
      }), 'prior items should all be hidden').to.be.true;

      // Check that the current items are visible
      expect(getPageItems().every((item) => {
        return !item.hasAttribute('style');
      }), 'current items should all be visible').to.be.true;
    });

    it('should be disabled on the first page', function () {
      // Check that the previous button is enabled
      expect(getPreviousButton().hasAttribute('disabled'), 'previous button should not be disabled on the first page').to.be.false;

      // Click the previous button
      getPreviousButton().click();

      // Get first page
      const firstPage = getItems()[0].getAttribute('data-page');

      // Check that `data-current-page` is set to the first page
      expect(getDataCurrentPage(), `\`data-current-page\` should be set to \`${firstPage}\``).to.equal(firstPage);

      // Check that the previous button is disabled
      expect(getPreviousButton().hasAttribute('disabled'), 'previous button should be disabled on the first page').to.be.true;
    });

    it('should update the previous button text', function () {
      // Reapply the HTML to the body
      document.body.innerHTML = innerHTML;

      // Get the original text of the previous button
      const originalPreviousText = getPreviousButton().querySelector('.visually-hidden').textContent;

      // Check that the previous button has the correct text
      expect(originalPreviousText, 'previous button should have correct text').to.equal('Previous 5 records');

      // Call the function
      shelfBrowse();

      // Get the number of items on the previous page
      const previousPageItems = Array.from(getItems()).filter((item) => {
        return item.getAttribute('data-page') === String(Number(getDataCurrentPage()) - 1);
      }).length;

      // Check that the previous button has the correct text
      expect(getPreviousButton().querySelector('.visually-hidden').textContent, 'previous button should have updated text').to.equal(`Previous ${previousPageItems} record${previousPageItems === 1 ? '' : 's'}`);
    });
  });

  describe('next records', function () {
    beforeEach(function () {
      // Call the function
      shelfBrowse();
    });

    it('should update the `data-current-page` attribute to be one more than the prior value', function () {
      // Get the `data-current-page` value before clicking the next button
      const priorDataCurrentPage = getDataCurrentPage(true);

      // Click the next button
      getNextButton().click();

      // Get expected page number
      const expectedPage = priorDataCurrentPage + 1;

      // Check that the carousel has `data-current-page` set to `1`
      expect(getDataCurrentPage(true), `\`data-current-page\` should be set to \`${expectedPage}\``).to.equal(expectedPage);
    });

    it('should set animation classes', function () {
      // Get page items
      const getPageItems = () => {
        return Array.from(getItems()).filter((item) => {
          return item.getAttribute('data-page') === getDataCurrentPage();
        });
      };

      // Get the prior items
      const priorItems = getPageItems();

      // Click the next button
      getNextButton().click();

      // Check that the prior items have an animation class
      expect(priorItems.every((item) => {
        return item.classList.contains('animation-out-next');
      }), 'prior items should all have the `animation-out-next` class').to.be.true;

      // Fast forward time
      fastForwardTime();

      // Check that the current items have an animation class
      expect(getPageItems().every((item) => {
        return item.classList.contains('animation-in-next');
      }), 'current items should all have the `animation-in-next` class').to.be.true;
    });

    it('should change visibility of records', function () {
      // Get page items
      const getPageItems = () => {
        return Array.from(getItems()).filter((item) => {
          return item.getAttribute('data-page') === getDataCurrentPage();
        });
      };

      // Get the prior items
      const priorItems = getPageItems();

      // Click the next button
      getNextButton().click();

      // Check that the prior items are visible
      expect(priorItems.every((item) => {
        return !item.hasAttribute('style');
      }), 'prior items should still be visible').to.be.true;

      // Fast forward time
      fastForwardTime();

      // Check that the prior items are hidden
      expect(priorItems.every((item) => {
        return item.getAttribute('style') === 'display: none;';
      }), 'prior items should all be hidden').to.be.true;

      // Check that the current items are visible
      expect(getPageItems().every((item) => {
        return !item.hasAttribute('style');
      }), 'current items should all be visible').to.be.true;
    });

    it('should be disabled on the last page', function () {
      // Check that the next button is enabled
      expect(getNextButton().hasAttribute('disabled'), 'next button should not be disabled on the last page').to.be.false;

      // Click the next button
      getNextButton().click();

      // Get last page
      const lastPage = getItems()[getItems().length - 1].getAttribute('data-page');

      // Check that `data-current-page` is set to the last page
      expect(getDataCurrentPage(), `\`data-current-page\` should be set to \`${lastPage}\``).to.equal(lastPage);

      // Check that the next button is disabled
      expect(getNextButton().hasAttribute('disabled'), 'next button should be disabled on the last page').to.be.true;
    });

    it('should update the next button text', function () {
      // Reapply the HTML to the body
      document.body.innerHTML = innerHTML;

      // Get the original text of the next button
      const originalNextText = getNextButton().querySelector('.visually-hidden').textContent;

      // Check that the next button has the correct text
      expect(originalNextText, 'next button should have correct text').to.equal('Next 5 records');

      // Call the function
      shelfBrowse();

      // Get the number of items on the next page
      const nextPageItems = Array.from(getItems()).filter((item) => {
        return item.getAttribute('data-page') === String(Number(getDataCurrentPage()) + 1);
      }).length;

      // Check that the next button has the correct text
      expect(getNextButton().querySelector('.visually-hidden').textContent, 'next button should have updated text').to.equal(`Next ${nextPageItems} record${nextPageItems === 1 ? '' : 's'}`);
    });
  });

  describe('Return to current record', function () {
    beforeEach(function () {
      // Call the function
      shelfBrowse();
    });

    it ('should be disabled when on starting page', function () {
      // Check that the current record button is disabled
      expect(getCurrentRecordButton().hasAttribute('disabled'), 'current record button should be disabled').to.be.true;

      // Click the next button
      getNextButton().click();

      // Check that the current record button is enabled
      expect(getCurrentRecordButton().hasAttribute('disabled'), 'current record button should not be disabled').to.be.false;
    });

    it('should return to current record', function () {
      // Click the next button to enable the current record button
      getNextButton().click();

      // Check that the current record is not on page 0
      expect(getDataCurrentPage(), '`data-current-page` should not be `0`').to.not.equal('0');

      // Click the return to current record button
      getCurrentRecordButton().click();

      // Check that the current record is on page 0
      expect(getDataCurrentPage(), '`data-current-page` should be `0`').to.equal('0');
    });
  });

  describe('Resizing', function () {
    let screenSizes = null;
    let visibleItems = null;

    beforeEach(function () {
      screenSizes = {
        medium: 820,
        small: 640
      };

      visibleItems = () => {
        return Array.from(getItems()).filter((item) => {
          return !item.hasAttribute('style');
        }).length;
      };
    });

    afterEach(function () {
      screenSizes = null;
      visibleItems = null;
    });

    it('should change the `data-first-page-difference` attribute on resize', function () {
      // Call the function
      shelfBrowse();

      // Get the `data-first-page-difference` value
      const getFirstPageDifference = () => {
        return getList().getAttribute('data-first-page-difference');
      };

      // Get initial `data-first-page-difference` value
      const priorFirstPageDifference = getFirstPageDifference();

      // Check the initial `data-first-page-difference` value
      expect(getFirstPageDifference(), '`data-first-page-difference` should be set to `1` by default').to.equal(priorFirstPageDifference);

      // Change the window width to less than `640`
      sinon.stub(window, 'innerWidth').value(screenSizes.small - 1);

      // Call the function again
      shelfBrowse();

      // Check that the `data-first-page-difference` attribute is different than the initial value
      expect(getFirstPageDifference(), '`data-first-page-difference` should be different than the prior value').to.not.equal(priorFirstPageDifference);
    });

    it('should change `data-page` attributes on resize', function () {
      // Call the function
      shelfBrowse();

      // Get the `data-page` value of the first item
      const getFirstItemPage = () => {
        return getItems()[0].getAttribute('data-page');
      };

      // Check the `data-page` value of the first item before resizing
      const firstPagePrior = getFirstItemPage();

      // Check the `data-page` value of the first item
      expect(getFirstItemPage(), 'first item should have `data-page` set to `-1`').to.equal(firstPagePrior);

      // Change the window width to less than `640`
      sinon.stub(window, 'innerWidth').value(screenSizes.small);

      // Call the function again
      shelfBrowse();

      // Check that the `data-page` value of the first item no longer matches the prior value
      expect(getFirstItemPage(), 'first item should no longer have `data-page` set to prior value').to.not.equal(firstPagePrior);
    });

    it('should show five records', function () {
      // Call the function
      shelfBrowse();

      // Check the current window width
      expect(window.innerWidth, 'window.innerWidth should be greater than or equal to `820`').to.be.greaterThanOrEqual(screenSizes.medium);

      // Check that only five records are visible by default
      expect(visibleItems(), 'should only have five visible items when window width is greater than or equal to `820`').to.equal(5);
    });

    it('should show three records', function () {
      // Change the window width to less than `820`, but greater than or equal to `640`
      sinon.stub(window, 'innerWidth').value(screenSizes.medium - 1);

      // Check the current window width
      expect(window.innerWidth, 'window.innerWidth should be less than `820`, and greater than or equal to `640`').to.be.greaterThanOrEqual(screenSizes.small).and.lessThan(screenSizes.medium);

      // Call the function
      shelfBrowse();

      // Fast forward time
      fastForwardTime();

      // Check that only three records are visible
      expect(visibleItems(), 'should only have three visible items when window width is less than `820`').to.equal(3);
    });

    it('should show one record', function () {
      // Change the window width to less than `640`
      sinon.stub(window, 'innerWidth').value(screenSizes.small - 1);

      // Check the current window width
      expect(window.innerWidth, 'window.innerWidth should be less than `640`').to.be.lessThan(screenSizes.small);

      // Call the function
      shelfBrowse();

      // Fast forward time
      fastForwardTime();

      // Check that only one record is visible
      expect(visibleItems(), 'should only have one visible item when window width is less than `640`').to.equal(1);
    });
  });
});
