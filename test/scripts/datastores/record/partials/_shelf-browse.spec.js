import { expect } from 'chai';
import shelfBrowse from '../../../../../assets/scripts/datastores/record/partials/_shelf-browse.js';
// Import sinon from 'sinon';

describe.only('shelfBrowse', function () {
  /* Uncomment
  let getCurrentRecordButton = null;
  let getPreviousButton = null;
  let getNextButton = null;
  */
  let getList = null;
  let getItems = null;
  let getCurrentRecord = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
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
          <li class="current-record"></li>
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

    /* Uncomment
    getCurrentRecordButton = () => {
      return document.querySelector('button.shelf-browse__return');
    };

    getPreviousButton = () => {
      return document.querySelector('button.shelf-browse__carousel--button-previous');
    };

    getNextButton = () => {
      return document.querySelector('button.shelf-browse__carousel--button-next');
    };
    */

    getList = () => {
      return document.querySelector('.shelf-browse__carousel--items');
    };

    getItems = () => {
      return document.querySelectorAll('.shelf-browse__carousel--items > li');
    };

    getCurrentRecord = () => {
      return document.querySelector('.current-record');
    };
  });

  afterEach(function () {
    /* Uncomment
    getCurrentRecordButton = null;
    getPreviousButton = null;
    getNextButton = null;
    */
    getList = null;
    getItems = null;
    getCurrentRecord = null;
  });

  describe('setPageNumbers()', function () {
    it('sets `data-current-page`', function () {
      // Check that the carousel does not have `data-current-page` set
      expect(getList().hasAttribute('data-current-page'), '`data-current-page` should not be set').to.be.false;

      // Call the function
      shelfBrowse();

      // Check that the carousel has `data-current-page` set to `0`
      expect(getList().getAttribute('data-current-page'), '`data-current-page` should be set to `0`').to.equal('0');
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

    it('should change `data-page` attributes on resize', function () {
      //
    });

    it('should set `data-page` of list items prior to `.current-record` be less than `0`', function () {
      //
    });

    it('should set `data-page` of list items after `.current-record` be more than `0`', function () {
      //
    });

    it('hides all list items that are not on page 0', function () {
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
  });

  describe('previous records', function () {
    it('should set an animation class', function () {
      //
    });

    it('should show the previous set of records', function () {
      //
    });

    it('should be disabled on the first page', function () {
      //
    });
  });

  describe('next records', function () {
    it('should set an animation class', function () {
      //
    });

    it('should show the next set of records', function () {
      //
    });

    it('should be disabled on the last page', function () {
      //
    });
  });

  describe('Return to current record', function () {
    it('should remove the `disabled` attribute when not viewing current record', function () {
      //
    });

    it('should show the current record', function () {
      //
    });
  });

  describe('Resizing', function () {
    it('should show five records', function () {
      //
    });

    it('should show three records', function () {
      //
    });

    it('should show one record', function () {
      //
    });
  });
});
