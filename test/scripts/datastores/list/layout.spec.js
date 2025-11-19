import {
  createDatastoreList,
  datastoreHeading,
  handleSelectionChange,
  initializeNonEmptyListFunctions,
  isTemporaryListEmpty,
  nonEmptyDatastores,
  temporaryList,
  toggleListElements,
  viewingTemporaryList
} from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

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

  describe('nonEmptyDatastores()', function () {
    it('should return an array', function () {
      // Check that an array is always returned
      expect(nonEmptyDatastores({}), '`nonEmptyDatastores()` should return an array').to.be.an('array');
    });

    it('should return datastore names that have records', function () {
      // Check that datastore names are in the array
      expect(nonEmptyDatastores(global.temporaryList), '`nonEmptyDatastores()` should return the names of the non-empty datastores').to.deep.equal(['catalog', 'onlinejournals']);
    });

    it('should return an empty array', function () {
      // Check that an empty array is returned
      expect(nonEmptyDatastores({}), '`nonEmptyDatastores()` should return an empty array').to.be.empty;
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

  describe('createDatastoreList()', function () {
    let datastores = null;

    beforeEach(function () {
      document.body.innerHTML = `
        <div class="list"></div>
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
      `;

      datastores = nonEmptyDatastores(global.temporaryList);

      // Call the function
      createDatastoreList(global.temporaryList);
    });

    afterEach(function () {
      datastores = null;
    });

    it('should create a heading for every non-empty datastore', function () {
      expect(document.querySelectorAll('h2').length, 'an `h2` should have been created for every non-empty datastore').to.equal(datastores.length);
    });

    it('should create an ordered list for every non-empty datastore', function () {
      expect(document.querySelectorAll('ol').length, 'an `ol` should have been created for every non-empty datastore').to.equal(datastores.length);
    });

    it('should create list items for every record in each non-empty datastore', function () {
      [...document.querySelectorAll('ol')].forEach((orderedList, index) => {
        expect(orderedList.querySelectorAll('li').length, 'an `li` should have been created for every record that exists in the non-empty datastore').to.equal(Object.keys(global.temporaryList[datastores[index]]).length);
      });
    });
  });

  describe('handleSelectionChange()', function () {
    let actions = null;
    let citationTabExample = null;
    let activeCitationTabStub = null;
    let listElement = null;
    let checkbox = null;
    let selectAll = null;

    beforeEach(function () {
      document.body.innerHTML = `
        <div class="list">
          <input type="checkbox" class="list__item--checkbox" />
          <div class="select-all">
            <input type="checkbox" />
          </div>
        </div>
      `;

      // Create sinon stubs for the action methods
      actions = {
        actionsPanelText: sinon.spy(),
        disableActionTabs: sinon.spy(),
        displayCSLData: sinon.spy(),
        generateCitations: sinon.spy(),
        selectAllState: sinon.spy(),
        selectedText: sinon.spy()
      };

      citationTabExample = 'APA';

      activeCitationTabStub = sinon.stub().returns(citationTabExample);

      // Initialize the function with the stubbed actions
      handleSelectionChange(actions, activeCitationTabStub);

      listElement = () => {
        return document.querySelector('.list');
      };

      checkbox = () => {
        return document.querySelector('.list__item--checkbox');
      };

      selectAll = () => {
        return document.querySelector('.select-all > input[type="checkbox"]');
      };
    });

    afterEach(function () {
      actions = null;
      activeCitationTabStub = null;
      listElement = null;
      checkbox = null;
      selectAll = null;
    });

    it('should call all action functions when a list item checkbox changes', function () {
      // Simulate a change event
      const event = new window.Event('change', { bubbles: true });
      checkbox().dispatchEvent(event);

      // Check if all actions were called
      Object.keys(actions).forEach((key) => {
        expect(actions[key].calledOnce, `\`${key}\` should have been called`).to.be.true;

        if (key === 'generateCitations') {
          expect(actions[key].calledOnceWithExactly(citationTabExample), '`generateCitations` should have been called with `activeCitationTab`').to.be.true;
        }
      });
    });

    it('should call all action functions when the `Select all` checkbox changes', function () {
      // Simulate a change event
      const event = new window.Event('change', { bubbles: true });
      selectAll().dispatchEvent(event);

      // Check if all actions were called
      Object.keys(actions).forEach((key) => {
        expect(actions[key].calledOnce, `\`${key}\` should have been called`).to.be.true;

        if (key === 'generateCitations') {
          expect(actions[key].calledOnceWithExactly(citationTabExample), '`generateCitations` should have been called with `activeCitationTab`').to.be.true;
        }
      });
    });

    it('should not call action functions for irrelevant changes', function () {
      // Create a `div` element
      const div = document.createElement('div');
      listElement().appendChild(div);

      // Simulate a change event on the created element
      const event = new window.Event('change', { bubbles: true });
      div.dispatchEvent(event);

      // Check if all actions were not called
      Object.keys(actions).forEach((key) => {
        expect(actions[key].called, `\`${key}\` should not have been called`).to.be.false;

        if (key === 'generateCitations') {
          expect(actions[key].calledOnceWithExactly(citationTabExample), '`generateCitations` should not have been called with `activeCitationTab`').to.be.false;
        }
      });
    });
  });

  describe('initializeNonEmptyListFunctions()', function () {
    let stubs = null;
    let handleChange = null;

    beforeEach(function () {
      // Create spies
      stubs = {
        actionsPanelText: sinon.stub(),
        displayCSLData: sinon.stub(),
        selectedText: sinon.stub()
      };
      handleChange = sinon.spy();

      // Call the function
      initializeNonEmptyListFunctions(stubs, handleChange);
    });

    afterEach(function () {
      stubs = null;
      handleChange = null;
    });

    it('calls all action methods', function () {
      // Check that all stubs are called once
      Object.keys(stubs).forEach((stub) => {
        expect(stubs[stub].calledOnce, `\`${stub}()\` should have been called once`).to.be.true;
      });
    });

    it('should call `handleChange` with `stubs` as argument', function () {
      // Check that `handleChange` was called with stubs
      expect(handleChange.calledOnceWithExactly(stubs), '`handleChange` should have been called with `stubs` once').to.be.true;
    });
  });

  describe('temporaryList()', function () {
    let stubs = null;
    let list = null;

    beforeEach(function () {
      // Create spies
      stubs = {
        createDatastoreList: sinon.stub(),
        initializeNonEmptyListFunctions: sinon.stub(),
        toggleListElements: sinon.stub()
      };
      list = sinon.spy();

      // Call the function
      temporaryList(list, stubs);
    });

    afterEach(function () {
      stubs = null;
      list = null;
    });

    it('should call `toggleListElements` with `list` as argument', function () {
      // Check that `toggleListElements` was called with stubs
      expect(stubs.toggleListElements.calledOnceWithExactly(list), '`toggleListElements` should have been called with `list` once').to.be.true;
    });

    it('should call `createDatastoreList` with `list` as argument', function () {
      // Check that `createDatastoreList` was called with stubs
      expect(stubs.createDatastoreList.calledOnceWithExactly(list), '`createDatastoreList` should have been called with `list` once').to.be.true;
    });

    describe('initializeNonEmptyListFunctions()', function () {
      it('should not be called if the temporary list is empty', function () {
        // Make the list empty
        list = [];
        expect(list, 'the temporary list should be empty').to.be.empty;

        // Check that `initializeNonEmptyListFunctions` was not called
        expect(stubs.initializeNonEmptyListFunctions.calledOnce, '`initializeNonEmptyListFunctions` should have not been called').to.be.false;
      });

      it('should be called if the temporary list is not empty', function () {
        // Make the list not empty
        list = global.temporaryList;
        expect(list, 'the temporary list should not be empty').to.not.be.empty;

        // Call the function again
        temporaryList(list, stubs);

        // Check that `initializeNonEmptyListFunctions` was called
        expect(stubs.initializeNonEmptyListFunctions.calledOnce, '`initializeNonEmptyListFunctions` should have been called').to.be.true;
      });
    });
  });
});
