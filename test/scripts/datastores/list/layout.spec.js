import {
  createDatastoreList,
  datastoreHeading,
  defaultTemporaryList,
  getSessionStorage,
  handleSelectionChange,
  initializeNonEmptyListFunctions,
  inTemporaryList,
  isTemporaryListEmpty,
  nonEmptyDatastores,
  setSessionStorage,
  temporaryList,
  toggleListElements,
  viewingTemporaryList
} from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

describe('layout', function () {
  describe('getSessionStorage()', function () {
    let getSessionStorageStub = null;

    const defaultValue = defaultTemporaryList;
    const itemName = 'exampleItem';

    beforeEach(function () {
      global.sessionStorage = { getItem: sinon.stub() };
      getSessionStorageStub = global.sessionStorage.getItem;

      // Reset the stub before each test
      getSessionStorageStub.reset();
    });

    it(`should throw an error if \`defaultValue\` is not provided`, function () {
      expect(() => {
        getSessionStorage({ itemName });
      }, '`getSessionStorage` should have thrown an error if `defaultValue` is not provided').to.throw('`defaultValue` is required');
    });

    it(`should throw an error if \`itemName\` is not provided`, function () {
      expect(() => {
        getSessionStorage({ defaultValue });
      }, '`getSessionStorage` should have thrown an error if `itemName` is not provided').to.throw('`itemName` is required');
    });

    it(`should call \`sessionStorage.getItem\` with \`${itemName}\``, function () {
      // Make sure `sessionStorage` is defined
      getSessionStorageStub.returns('');

      // Call the function
      getSessionStorage({ defaultValue, itemName });

      // Check that `sessionStorage.getItem` was called with `itemName`
      expect(getSessionStorageStub.calledOnceWithExactly(itemName), `\`${itemName}\` should have been called`).to.be.true;
    });

    describe('returning valid data', function () {
      it('should parse and return a string value from `sessionStorage.getItem`', function () {
        // Create and assign a string value
        const string = 'example';
        getSessionStorageStub.withArgs(itemName).returns(`"${string}"`);

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns the string value
        expect(result, `the result should have returned ${string}`).to.equal(string);
      });

      it('should parse and return an object from `sessionStorage.getItem`', function () {
        // Create and assign an object value
        const obj = { abc: 1, def: 'c' };
        getSessionStorageStub.withArgs(itemName).returns(JSON.stringify(obj));

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns the object value
        expect(result, 'the result should have returned the object value').to.deep.equal(obj);
      });
    });

    describe('returning `defaultValue`', function () {
      it('should return `defaultValue` if `sessionStorage.getItem` returns `null`', function () {
        // Assign `null`
        getSessionStorageStub.withArgs(itemName).returns(null);

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns `defaultValue`
        expect(result, 'the result should have returned `defaultValue`').to.deep.equal(defaultValue);
      });

      it('should return `defaultValue` if `sessionStorage.getItem` returns "undefined"', function () {
        // Assign "undefined"
        getSessionStorageStub.withArgs(itemName).returns('undefined');

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns `defaultValue`
        expect(result, 'the result should have returned `defaultValue`').to.deep.equal(defaultValue);
      });

      it('should return `defaultValue` if `sessionStorage.getItem` returns "null"', function () {
        // Assign "null"
        getSessionStorageStub.withArgs(itemName).returns('null');

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns `defaultValue`
        expect(result, 'the result should have returned `defaultValue`').to.deep.equal(defaultValue);
      });

      it('should return `defaultValue` if `sessionStorage.getItem` returns an empty string', function () {
        // Assign an empty string
        getSessionStorageStub.withArgs(itemName).returns('');

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns `defaultValue`
        expect(result, 'the result should have returned `defaultValue`').to.deep.equal(defaultValue);
      });

      it('should return `defaultValue` if `sessionStorage.getItem` returns invalid JSON', function () {
        // Assign invalid JSON
        getSessionStorageStub.withArgs(itemName).returns('not valid json');

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns `defaultValue`
        expect(result, 'the result should have returned `defaultValue`').to.deep.equal(defaultValue);
      });
    });
  });

  describe('setSessionStorage()', function () {
    let setSessionStorageStub = null;

    const itemName = 'exampleItem';
    const value = { example: true };

    beforeEach(function () {
      global.sessionStorage = { setItem: sinon.stub() };
      setSessionStorageStub = global.sessionStorage.setItem;

      // Reset the stub before each test
      setSessionStorageStub.reset();
    });

    it(`should throw an error if \`itemName\` is not provided`, function () {
      expect(() => {
        setSessionStorage({ value });
      }, '`setSessionStorage` should have thrown an error if `itemName` is not provided').to.throw('`itemName` is required');
    });

    it(`should throw an error if \`value\` is not provided`, function () {
      expect(() => {
        setSessionStorage({ itemName });
      }, '`setSessionStorage` should have thrown an error if `value` is not provided').to.throw('`value` is required');
    });

    it(`should stringify and set the value in \`sessionStorage\` under \`${itemName}\``, function () {
      // Call the function
      setSessionStorage({ itemName, value });

      // Check that a stringified value was set under `temporaryList`
      expect(setSessionStorageStub.calledOnceWithExactly(itemName, JSON.stringify(value)), `the value should have been stringified under \`${itemName}\``).to.be.true;
    });

    it('should handle string values too', function () {
      // Create a string value
      const string = 'example';
      expect(string, 'the example should be a string').to.be.a('string');

      // Call the function
      setSessionStorage({ itemName, value: string });

      // Check that a stringified value was set under `temporaryList`
      expect(setSessionStorageStub.calledOnceWithExactly(itemName, JSON.stringify(string)), `the string value should have returned under \`${itemName}\``).to.be.true;
    });
  });

  describe('inTemporaryList()', function () {
    let list = null;
    let recordDatastore = null;
    let recordId = null;

    beforeEach(function () {
      list = { ...global.temporaryList };
      // Grab the first datastore
      [recordDatastore] = Object.keys(global.temporaryList);
      // Grab the first record ID of the first datastore
      [recordId] = Object.keys(global.temporaryList[recordDatastore]);
    });

    afterEach(function () {
      list = null;
      recordDatastore = null;
      recordId = null;
    });

    it('should return true if both recordDatastore and recordId exist', function () {
      // Assign the result
      const result = inTemporaryList({ list, recordDatastore, recordId });

      // Check that the result returns true
      expect(result, '`inTemporaryList` should have returned `true`').to.be.true;
    });

    it('should return false if recordDatastore exists but recordId does not', function () {
      // Assign the result with a non-existent record ID
      const result = inTemporaryList({ list, recordDatastore, recordId: 'non-existent' });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` for a non-existent record ID').to.be.false;
    });

    it('should return false if recordDatastore does not exist', function () {
      // Assign the result with a non-existent datastore
      const result = inTemporaryList({ list, recordDatastore: 'non-existent', recordId });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` for a non-existent datastore').to.be.false;
    });

    it('should return false if list is empty', function () {
      // Assign the result with an empty list
      const result = inTemporaryList({ list: {}, recordDatastore, recordId });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` for an empty list').to.be.false;
    });

    it('should handle recordDatastore that exists but is not an object gracefully', function () {
      // Make the datastore return `null`
      list[recordDatastore] = null;

      // Assign the result
      const result = inTemporaryList({ list, recordDatastore, recordId });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` if a datastore returns null').to.be.false;
    });
  });

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
              <span class="list__item--title-number">0.</span>
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
    let args = null;
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
        regenerateCitations: sinon.spy(),
        selectAllState: sinon.spy(),
        selectedText: sinon.spy()
      };

      args = { actions, list: global.temporaryList };

      // Initialize the function with the stubbed actions
      handleSelectionChange(args);

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
      args = null;
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
      });

      // Check that `displayCSLData` was called with the correct arguments
      expect(actions.displayCSLData.calledWithExactly({ list: args.list }), '`displayCSLData` should have been called with the correct arguments').to.be.true;
    });

    it('should call all action functions when the `Select all` checkbox changes', function () {
      // Simulate a change event
      const event = new window.Event('change', { bubbles: true });
      selectAll().dispatchEvent(event);

      // Check if all actions were called
      Object.keys(actions).forEach((key) => {
        expect(actions[key].calledOnce, `\`${key}\` should have been called`).to.be.true;
      });

      // Check that `displayCSLData` was called with the correct arguments
      expect(actions.displayCSLData.calledWithExactly({ list: args.list }), '`displayCSLData` should have been called with the correct arguments').to.be.true;
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
      });
    });
  });

  describe('initializeNonEmptyListFunctions()', function () {
    let actions = null;
    let handleChange = null;
    let args = null;

    beforeEach(function () {
      // Create spies
      actions = {
        actionsPanelText: sinon.stub(),
        displayCSLData: sinon.stub(),
        selectedText: sinon.stub()
      };
      handleChange = sinon.spy();
      args = { actions, handleChange, list: global.temporaryList };

      // Call the function
      initializeNonEmptyListFunctions(args);
    });

    afterEach(function () {
      actions = null;
      handleChange = null;
      args = null;
    });

    it('calls all action methods', function () {
      // Check that all actions are called once
      Object.keys(actions).forEach((action) => {
        expect(actions[action].calledOnce, `\`${action}()\` should have been called once`).to.be.true;
      });
    });

    it('should call `handleChange` with `actions` as argument', function () {
      // Check that `handleChange` was called with actions
      expect(handleChange.calledOnceWithExactly({ actions: args.actions, list: args.list }), '`handleChange` should have been called with `actions` once').to.be.true;
    });
  });

  describe('temporaryList()', function () {
    let listFunctions = null;
    let list = null;
    let args = null;

    beforeEach(function () {
      // Create spies
      listFunctions = {
        createDatastoreList: sinon.stub(),
        initializeNonEmptyListFunctions: sinon.stub(),
        toggleListElements: sinon.stub()
      };
      list = sinon.spy();
      args = { list, listFunctions };

      // Call the function
      temporaryList(args);
    });

    afterEach(function () {
      listFunctions = null;
      list = null;
    });

    it('should call `toggleListElements` with `list` as argument', function () {
      // Check that `toggleListElements` was called with stubs
      expect(listFunctions.toggleListElements.calledOnceWithExactly(list), '`toggleListElements` should have been called with `list` once').to.be.true;
    });

    it('should call `createDatastoreList` with `list` as argument', function () {
      // Check that `createDatastoreList` was called with stubs
      expect(listFunctions.createDatastoreList.calledOnceWithExactly(list), '`createDatastoreList` should have been called with `list` once').to.be.true;
    });

    describe('initializeNonEmptyListFunctions()', function () {
      it('should not be called if the temporary list is empty', function () {
        // Make the list empty
        args.list = [];
        expect(args.list, 'the temporary list should be empty').to.be.empty;

        // Check that `initializeNonEmptyListFunctions` was not called
        expect(listFunctions.initializeNonEmptyListFunctions.calledOnce, '`initializeNonEmptyListFunctions` should have not been called').to.be.false;
      });

      it('should be called if the temporary list is not empty', function () {
        // Make the list not empty
        args.list = global.temporaryList;
        expect(args.list, 'the temporary list should not be empty').to.not.be.empty;

        // Call the function again
        temporaryList(args);

        // Check that `initializeNonEmptyListFunctions` was called
        expect(listFunctions.initializeNonEmptyListFunctions.calledOnce, '`initializeNonEmptyListFunctions` should have been called').to.be.true;
      });
    });
  });
});
