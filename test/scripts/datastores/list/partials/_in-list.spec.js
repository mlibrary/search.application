import { changeCount, getInList, selectedText } from '../../../../../assets/scripts/datastores/list/partials/_in-list.js';
import { getCheckboxes, getCheckedCheckboxes } from '../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { viewingTemporaryList } from '../../../../../assets/scripts/datastores/list/layout.js';

describe('in-list', function () {
  let getInListElement = null;
  let getInListText = null;
  let initialText = null;
  let getCount = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__in-list">
        <span class="strong">0</span> in list
      </div>
      <ol class="list__items">
        <li><input type="checkbox" class="list__item--checkbox" value="rec1" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="rec2"></li>
        <li><input type="checkbox" class="list__item--checkbox" value="rec3"></li>
        <li><input type="checkbox" class="list__item--checkbox" value="rec4" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="rec5"></li>
      </ol>
    `;

    getInListElement = () => {
      return document.querySelector('.list__in-list');
    };

    getInListText = () => {
      return getInListElement().textContent;
    };

    initialText = getInListText();

    getCount = () => {
      return Number(getInListElement().querySelector('span.strong').textContent);
    };
  });

  afterEach(function () {
    getInListElement = null;
    getInListText = null;
    initialText = null;
    getCount = null;
  });

  describe('getInList()', function () {
    it('should return the in-list element', function () {
      // Check that the correct element is returned
      expect(getInList(), 'the returned element should be the in-list element').to.equal(getInListElement());
    });
  });

  describe('changeCount()', function () {
    it('should return `0` if no argument is provided', function () {
      // Call the function
      changeCount();

      // Check that the count remains 0
      expect(getCount(), 'the count should change to `0` with no argument').to.equal(0);
    });

    it('should return `0` if the argument is a non-number', function () {
      // Create a non-number argument
      const nonNumber = 'string';

      // Check that the argument is not a number
      expect(typeof nonNumber, 'the argument should not be a number').to.not.equal('number');

      // Call the function
      changeCount(nonNumber);

      // Check that the count remains 0
      expect(getCount(), 'the count should change to `0` with a non number argument').to.equal(0);
    });

    it('should update the count based on the given argument', function () {
      // Create a count
      const count = 1337;

      // Call the function
      changeCount(count);

      // Check that the count is updated correctly
      expect(getCount(), `the count should equal to \`${count}\``).to.equal(count);
    });
  });

  describe('selectedText()', function () {
    describe('when not viewing the temporary list', function () {
      beforeEach(function () {
        // Check that Temporary List is not being viewed
        expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

        // Call the function
        selectedText();
      });

      it('should not update the text', function () {
        // Check that the text was not updated
        expect(getInListElement().textContent).to.equal(initialText);
      });
    });

    describe('when viewing the temporary list', function () {
      let originalWindow = null;

      beforeEach(function () {
        // Save the original window object
        originalWindow = global.window;

        // Setup JSDOM with an updated URL
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
          url: 'http://localhost/everything/list'
        });

        // Override the global window object
        global.window = dom.window;

        // Check that Temporary List is being viewed
        expect(viewingTemporaryList(), 'the current pathname should be `/everything/list`').to.be.true;
      });

      afterEach(function () {
        // Restore the original window object
        global.window = originalWindow;
      });

      it('should update the text if viewing the temporary list', function () {
        // Check that there are multiple checkboxes
        expect(getCheckboxes().length).to.be.greaterThan(1);

        // Call the function
        selectedText();

        // Check that the text was updated
        expect(getInListText(), 'the text should be correct for multiple records').to.equal(`${getCheckedCheckboxes().length} out of ${getCheckboxes().length} items selected.`);
      });

      it('should use singular text when one record is selected', function () {
        // Remove all but one checkbox
        document.querySelectorAll('input[type="checkbox"].list__item--checkbox').forEach((checkbox, index) => {
          if (index > 0) {
            checkbox.remove();
          }
        });

        // Check that there is only one checkbox
        expect(getCheckboxes().length).to.equal(1);

        // Call the function
        selectedText();

        // Check that the text was updated
        expect(getInListText(), 'the text should be correct for a selected single record').to.equal(`${getCheckedCheckboxes().length} out of ${getCheckboxes().length} item selected.`);
      });
    });
  });
});
