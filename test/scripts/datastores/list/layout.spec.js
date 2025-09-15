import { getCheckboxes, someCheckboxesChecked, temporaryList } from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { setTemporaryList } from '../../../../assets/scripts/datastores/list/partials/_add-to.js';
import sinon from 'sinon';

const checkboxHTML = `
  <ol class="list__items">
    <li><input type="checkbox" class="list__item--checkbox" value="rec1" checked></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec2"></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec3"></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec4"></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec5"></li>
  </ol>
`;

describe('layout', function () {
  describe('getCheckboxes()', function () {
    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = checkboxHTML;
    });

    it('should return all the checkboxes in the temporary list', function () {
      // Check that the correct elements are returned
      expect(getCheckboxes(), 'the correct elements should be returned').to.deep.equal(document.querySelectorAll('ol.list__items input[type="checkbox"].list__item--checkbox'));
    });
  });

  describe('someCheckboxesChecked()', function () {
    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = checkboxHTML;
    });

    describe('true', function () {
      it('should return `true` if at least one checkbox is checked', function () {
        expect(someCheckboxesChecked(true), 'the function should return `true` if at least one checkbox is checked').to.be.true;
      });

      it('should return `false` if no checkboxes are checked', function () {
        // Uncheck all the checkboxes
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = false;
        });

        // Check that the function returns false
        expect(someCheckboxesChecked(true), 'the function should return `false` if no checkboxes are checked').to.be.false;
      });
    });

    describe('false', function () {
      it('should return `true` if at least one checkbox is unchecked', function () {
        expect(someCheckboxesChecked(false), 'the function should return `true` if at least one checkbox is unchecked').to.be.true;
      });

      it('should return `false` if all checkboxes are checked', function () {
        // Check all the checkboxes
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = true;
        });

        // Check that the function returns false
        expect(someCheckboxesChecked(false), 'the function should return `false` if all checkboxes are checked').to.be.false;
      });
    });
  });

  describe('temporaryList()', function () {
    let getOrderedList = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <div class="list">
          <div class="list__in-list">
            <span class="strong"></span>
          </div>
          <div class="list">
            <div class="list__in-list">
              <span class="strong"></span>
            </div>
            <p class="list__empty">The list is empty.</p>
          </div>
          <div class="list__actions"></div>
          <li class="container__rounded list__item list__item--clone">
            <div class="list__item--header">
              <input type="checkbox" class="list__item--checkbox" value="" aria-label="Select record">
              <h3 class="list__item--title">
                <a href="http://example.com/" class="list__item--title-original">
                  Original Title
                </a>
                <span class="list__item--title-transliterated h5">
                  Transliterated Title
                </span>
              </h3>
            </div>
            <table class="metadata">
              <tbody>
                <tr class="metadata__row--clone">
                  <th scope="row">
                    Field
                  </th>
                  <td>
                    <span class="metadata__data--original">
                      Original Data
                    </span>
                    <span class="metadata__data--transliterated">
                      Transliterated Data
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        </div>
      `;

      global.sessionStorage = window.sessionStorage;

      getOrderedList = () => {
        return document.querySelector('ol');
      };
    });

    afterEach(function () {
      delete global.sessionStorage;

      getOrderedList = null;
    });

    it('should call `changeCount`', function () {
      expect(temporaryList.toString()).to.include('changeCount(');
    });

    it('should toggle the empty message based on the list count', function () {
      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Call the function
      temporaryList();

      // Check that the empty message is hidden
      expect(document.querySelector('.list__empty').style.display, 'the empty message should be hidden if there are items in the list').to.equal('none');

      // Set an empty temporary list in session storage and call the function again
      setTemporaryList({});
      temporaryList();

      // Check that the empty message is shown
      expect(document.querySelector('.list__empty').hasAttribute('style'), 'the empty message should be shown if there are no items in the list').to.be.false;
    });

    it('should toggle the actions panel based on the list count', function () {
      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Call the function
      temporaryList();

      // Check that the actions panel is shown
      expect(document.querySelector('.list__actions').hasAttribute('style'), 'the actions panel should be shown if there are items in the list').to.be.false;

      // Set an empty temporary list in session storage and call the function again
      setTemporaryList({});
      temporaryList();

      // Check that the actions panel is hidden
      expect(document.querySelector('.list__actions').style.display, 'the actions panel should be hidden if there are no items in the list').to.equal('none');
    });

    it('should create a heading based off of the datastore', function () {
      // Get the heading
      const getHeading = () => {
        return document.querySelector('h2');
      };

      // Check that an h2 does not exist
      expect(getHeading(), 'an `h2` should not exist in an empty list').to.be.null;

      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Call the function
      temporaryList();

      // Check that an h2 now exists
      expect(getHeading(), 'an `h2` should exist in a non-empty list').to.not.be.null;
      expect(getHeading().textContent, 'an `h2` should have text').to.equal('Catalog');
    });

    it('should create an ordered list that includes the provided records', function () {
      // Check that an ordered list does not exist
      expect(getOrderedList(), 'an ordered list should not exist in an empty list').to.be.null;

      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Call the function
      temporaryList();

      // Check that an ordered list now exists
      expect(getOrderedList(), 'an ordered list should exist in a non-empty list').to.not.be.null;

      // Check that classes have been added to the ordered list
      expect(getOrderedList().classList.contains('list__items', 'list__no-style'), 'classes should have been added to the ordered list').to.be.true;

      // Check that the ordered list has a list item for each record
      expect(getOrderedList().querySelectorAll('li').length, 'a list item should exist for each provided record').to.equal(Object.keys(global.temporaryList).length);
    });

    it('should add a `change` event listener to the list container', function () {
      // Create the `addEventListener` spy
      const spy = sinon.spy(document.querySelector('.list'), 'addEventListener');

      // Call the function
      temporaryList();

      // Check that the event listener was called with `change`
      expect(spy.calledWith('change'), 'the list container should have been called with a `change` event listener').to.be.true;
    });
  });
});
