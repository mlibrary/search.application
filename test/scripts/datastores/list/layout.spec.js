import { datastoreHeading, isTemporaryListEmpty, temporaryList, toggleListElements, viewingTemporaryList } from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { setTemporaryList } from '../../../../assets/scripts/datastores/list/partials/_add-to.js';
import sinon from 'sinon';

const actionsPanelHTML = `
  <div class="actions__summary--header">
    <small></small>
  </div>
`;

describe('layout', function () {
  describe('viewingTemporaryList()', function () {
    beforeEach(function () {
      // Check that the current pathname is not `/everything/list`
      expect(window.location.pathname, 'the current pathname should not be `/everything/list`').to.not.equal('/everything/list');
    });

    it('should be `false` if the current pathname is not `/everything/list`', function () {
      // Check that My Temporary List is not being viewed
      expect(viewingTemporaryList(), 'the variable should be `false` if the current pathname is not `/everything/list`').to.be.false;
    });

    it('should be `true` if the current pathname is `/everything/list`', function () {
      // Store the original window object
      const originalWindow = global.window;

      // Setup JSDOM with an updated URL
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        url: 'http://localhost/everything/list'
      });

      // Override the global window object
      global.window = dom.window;

      // Check that My Temporary List is being viewed
      expect(viewingTemporaryList(), 'the variable should be `true` if the current pathname is `/everything/list`').to.be.true;

      // Restore the original window object
      global.window = originalWindow;
    });
  });

  describe('isTemporaryListEmpty()', function () {
    it('should return `false` if at least one datastore has at least one record saved', function () {
      // Check that the temporary list is not empty
      expect(isTemporaryListEmpty(global.temporaryList), 'the temporary list should not be empty').to.be.false;
    });

    it('should return `true` if all datastores do not have records saved to them', function () {
      // Create a copy of the temporary list and remove all saved records
      const list = { ...global.temporaryList };
      Object.keys(list).forEach((datastore) => {
        list[datastore] = {};
      });

      // Check that the temporary list is empty
      expect(isTemporaryListEmpty(list), 'the temporary list should be empty').to.be.true;
    });
  });

  describe('toggleListElements()', function () {
    let getListActions = null;
    let getEmptyMessage = null;
    let list = null;

    beforeEach(function () {
      document.body.innerHTML = `
        <div class="list__actions"></div>
        <div class="list__empty"></div>
      `;

      getListActions = () => {
        return document.querySelector('.list__actions');
      };

      getEmptyMessage = () => {
        return document.querySelector('.list__empty');
      };

      list = { ...global.temporaryList };
    });

    afterEach(function () {
      getListActions = null;
      getEmptyMessage = null;
      list = null;
    });

    describe('non-empty temporary list', function () {
      beforeEach(function () {
        // Check that the temporary list is not empty
        expect(isTemporaryListEmpty(list), 'the temporary list should not be empty').to.be.false;

        // Call the function
        toggleListElements(list);
      });

      it('should show actions', function () {
        // Check that the `style` attribute does not exist for Actions
        expect(getListActions().hasAttribute('style'), 'the `style` attribute should not exist for Actions').to.be.false;
      });

      it('should hide the empty message', function () {
        // Check that the empty message's `style` is set to `none`
        expect(getEmptyMessage().style.display, 'the empty message should be hidden').to.equal('none');
      });
    });

    describe('empty temporary list', function () {
      beforeEach(function () {
        // Remove all saved records from the list
        Object.keys(list).forEach((datastore) => {
          list[datastore] = {};
        });

        // Check that the temporary list is empty
        expect(isTemporaryListEmpty(list), 'the temporary list should be empty').to.be.true;

        // Call the function
        toggleListElements(list);
      });

      it('should hide actions', function () {
        // Check that Actions's `style` is set to `none`
        expect(getListActions().style.display, 'actions should be hidden').to.equal('none');
      });

      it('should show the empty message', function () {
        // Check that the `style` attribute does not exist for the empty message
        expect(getEmptyMessage().hasAttribute('style'), 'the `style` attribute should not exist for the empty message').to.be.false;
      });
    });
  });

  describe('datastoreHeading()', function () {
    let getHeading = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = '';

      getHeading = () => {
        return document.querySelector('h2');
      };

      // Check that an h2 does not exist
      expect(getHeading(), 'an `h2` should not exist before the function is called').to.be.null;
    });

    afterEach(function () {
      // Check that an h2 now exists
      expect(getHeading(), 'an `h2` should exist after the function is called').to.not.be.null;

      getHeading = null;
    });

    it('should create an h2 with the correct text for a normal datastore', function () {
      const datastore = 'catalog';

      // Call the function and append the heading to the body
      document.body.appendChild(datastoreHeading(datastore));

      // Check that the text is correct
      expect(getHeading().textContent, 'the `h2` should have the correct datastore in title case').to.equal(datastore.charAt(0).toUpperCase() + datastore.slice(1));
    });

    it('should create an h2 with the correct text for the `onlinejournals` datastore', function () {
      // Call the function and append the heading to the body
      document.body.appendChild(datastoreHeading('onlinejournals'));

      // Check that the text is correct
      expect(getHeading().textContent, 'the `h2` should have the correct datastore in title case for `onlinejournals`').to.equal('Online Journals');
    });

    it('should create an h2 with the correct text for the `guidesandmore` datastore', function () {
      // Call the function and append the heading to the body
      document.body.appendChild(datastoreHeading('guidesandmore'));

      // Check that the text is correct
      expect(getHeading().textContent, 'the `h2` should have the correct datastore in title case for `guidesandmore`').to.equal('Guides and More');
    });
  });

  describe.skip('temporaryList()', function () {
    let getHeadings = null;
    let getOrderedLists = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <div class="list">
          <div class="list__actions">
            ${actionsPanelHTML}
            <div class="list__actions--utilities">
              <div class="list__in-list"></div>
            </div>
          </div>
          <p class="list__empty">The list is empty.</p>
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

      getHeadings = () => {
        return document.querySelectorAll('h2');
      };

      getOrderedLists = () => {
        return document.querySelectorAll('ol');
      };
    });

    afterEach(function () {
      delete global.sessionStorage;

      getHeadings = null;
      getOrderedLists = null;
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

    it('should create a heading for each non-empty datastore', function () {
      // Check that no h2s exist
      expect(getHeadings(), 'an `h2` should not exist in an empty list').to.be.empty;

      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Call the function
      temporaryList();

      // Check that non-empty h2s now exists
      const nonEmptyDatastores = Object.values(global.temporaryList).filter((datastore) => {
        return Object.keys(datastore).length > 0;
      }).length;
      expect(getHeadings(), 'an `h2` should exist in a non-empty list').to.not.be.null;
      expect(getHeadings().length, 'an `h2` should exist for each non-empty datastore').to.equal(nonEmptyDatastores);
      getHeadings().forEach((heading) => {
        expect(heading.textContent, 'an `h2` should have text').to.not.be.empty;
      });
    });

    it('should create an ordered list that includes the provided records for each non-empty datastore', function () {
      // Check that an ordered list does not exist
      expect(getOrderedLists(), 'an ordered list should not exist in an empty list').to.be.empty;

      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Call the function
      temporaryList();

      // Check that ordered lists now exists
      const nonEmptyDatastores = Object.keys(global.temporaryList).filter((datastore) => {
        return Object.keys(global.temporaryList[datastore]).length > 0;
      });

      expect(getOrderedLists(), 'an `ol` should exist').to.not.be.empty;
      expect(getOrderedLists().length, 'an `ol` should exist for each non-empty datastore').to.equal(nonEmptyDatastores.length);

      // Get the properties of the temporary list that are non-empty
      getOrderedLists().forEach((orderedList, index) => {
        // Check that classes have been added to the ordered list
        expect(orderedList.classList.contains('list__items', 'list__no-style'), 'classes should have been added to the ordered list').to.be.true;

        // Check that the ordered list has a list item for each record
        expect(orderedList.querySelectorAll('li').length, 'a list item should exist for each provided record').to.equal(Object.keys(global.temporaryList[nonEmptyDatastores[index]]).length);
      });
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
