import {
  createDatastoreList,
  defaultTemporaryList,
  getDatastores,
  getSessionStorage,
  handleSelectionChange,
  initializeNonEmptyListFunctions,
  inTemporaryList,
  setSessionStorage,
  temporaryList,
  toggleListElements,
  viewingTemporaryList
} from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

let lists = '';
Object.keys(defaultTemporaryList).forEach((datastore) => {
  lists += `
    <section class="list__datastore list__${datastore}" data-datastore="${datastore}">
      <li class="container__rounded results__list-item record__container" data-record-id="1337" data-record-datastore="catalog">
        <div class="results__list-item--header">
        <input type="checkbox" class="record__checkbox" value="catalog,1337" aria-label="Select Original Title">
        <h3 class="h4 results__list-item--title">
          <span class="results__list-item--title-number">1.</span>
          <a href="catalog/record/1337" class="results__list-item--title-original">Original Title</a>
          <span class="h5 results__list-item--title-transliterated">
            Transliterated Title
          </span>
        </h3>
      </div>
      <table class="metadata">
        <thead class="visually-hidden">
          <tr>
            <th scope="col">Field</th>
            <th scope="col">Data</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <th scope="row">
                Published/Created
              </th>
              <td>
                <ul class="list__no-style metadata__list metadata__list--plain-text" id="metadata__toggle--published">
                  <li>
                    <ul class="list__no-style metadata__list--parallel">
                      <li>
                        Transliterated Data
                      </li>
                      <li>
                        Original Data
                      </li>
                    </ul>
                  </li>
                </ul>
                <button class="button__ghost metadata__toggle" aria-expanded="true" aria-controls="metadata__toggle--published" data-toggle="3">
                  Show fewer Published/Created
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </li>
    </section>
  `;
});

describe('layout', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__empty"></div>
      <div class="datastore-lists">
        ${lists}
      </div>
    `;
  });

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

      it('should return `defaultTemporaryList` if `sessionStorage` is not accessible', function () {
        // Make `sessionStorage.getItem` throw an error
        getSessionStorageStub.withArgs(itemName).throws(new Error('`sessionStorage` is not accessible'));

        // Assign the result
        const result = getSessionStorage({ defaultValue, itemName });

        // Check that the result returns `defaultTemporaryList`
        expect(result, 'the result should have returned `defaultTemporaryList`').to.deep.equal(defaultTemporaryList);
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

  describe('getDatastores()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        empty: false,
        list: global.temporaryList
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return an array', function () {
      // Check that an array is always returned
      expect(getDatastores(args), '`getDatastores()` should return an array').to.be.an('array');
    });

    it('should return datastore names that have records', function () {
      // Check that datastore names are in the array
      expect(getDatastores(args), '`getDatastores()` should return the names of the non-empty datastores').to.deep.equal(['catalog', 'onlinejournals']);
    });

    it('should return datastore names that do not have records', function () {
      // Check that datastore names are in the array
      expect(getDatastores({ ...args, empty: true }), '`getDatastores()` should return the names of the empty datastores').to.deep.equal(['articles', 'databases', 'everything', 'guidesandmore']);
    });
  });

  describe('inTemporaryList()', function () {
    let list = null;
    let recordDatastore = null;
    let recordId = null;

    beforeEach(function () {
      list = { ...global.temporaryList };
      // Grab the first non-empty datastore
      [recordDatastore] = getDatastores({ list });
      // Grab the first record ID of the first non-empty datastore
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

  describe('toggleListElements()', function () {
    let removeEmptyListMessageSpy = null;
    let removeEmptyDatastoreSectionsSpy = null;
    let removeListResultsSpy = null;
    let args = null;

    beforeEach(function () {
      removeEmptyListMessageSpy = sinon.spy();
      removeEmptyDatastoreSectionsSpy = sinon.spy();
      removeListResultsSpy = sinon.spy();
      args = {
        list: global.temporaryList,
        nonEmptyDatastores: getDatastores({ list: global.temporaryList }),
        removeEmptyMessage: removeEmptyListMessageSpy,
        removeLists: removeEmptyDatastoreSectionsSpy,
        removeResults: removeListResultsSpy
      };
    });

    afterEach(function () {
      removeEmptyListMessageSpy = null;
      removeEmptyDatastoreSectionsSpy = null;
      removeListResultsSpy = null;
      args = null;
    });

    describe('non-empty temporary list', function () {
      beforeEach(function () {
        // Check that the temporary list is not empty
        expect(args.nonEmptyDatastores.length, 'the temporary list should not be empty').to.be.above(0);

        // Call the function
        toggleListElements(args);
      });

      it('should call `removeEmptyListMessage`', function () {
        // Check that `removeEmptyListMessage` was called
        expect(removeEmptyListMessageSpy.calledOnce, '`removeEmptyListMessage` should have been called once').to.be.true;
      });

      it('should call `removeEmptyDatastoreSections` with the correct arguments', function () {
        // Check that `removeEmptyDatastoreSections` was called
        expect(removeEmptyDatastoreSectionsSpy.calledOnceWithExactly({ datastores: args.nonEmptyDatastores }), '`removeEmptyDatastoreSections` should have been called with the correct arguments').to.be.true;
      });

      it('should not call `removeResults`', function () {
        // Check that `removeResults` was not called
        expect(removeListResultsSpy.notCalled, '`removeResults` should not have been called').to.be.true;
      });
    });

    describe('empty temporary list', function () {
      beforeEach(function () {
        // Check that the temporary list is empty
        args.nonEmptyDatastores = [];
        expect(args.nonEmptyDatastores.length, 'the temporary list should be empty').to.equal(0);

        // Call the function
        toggleListElements(args);
      });

      it('should call `removeResults`', function () {
        // Check that `removeResults` was called
        expect(removeListResultsSpy.calledOnce, '`removeResults` should have been called once').to.be.true;
      });

      it('should not call `removeEmptyListMessage`', function () {
        // Check that `removeEmptyListMessage` was not called
        expect(removeEmptyListMessageSpy.notCalled, '`removeEmptyListMessage` should not have been called').to.be.true;
      });

      it('should not call `removeEmptyDatastoreSections`', function () {
        // Check that `removeEmptyDatastoreSections` was not called
        expect(removeEmptyDatastoreSectionsSpy.notCalled, '`removeEmptyDatastoreSections` should not have been called').to.be.true;
      });
    });
  });

  describe('createDatastoreList()', function () {
    let datastores = null;

    beforeEach(function () {
      document.body.innerHTML = `
        <div class="list"></div>
        <li class="container__rounded list__item list__item--clone">
          <div class="list__item--header">
            <input type="checkbox" class="record__checkbox" value="" aria-label="Select record">
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

      datastores = getDatastores({ list: global.temporaryList });

      // Call the function
      createDatastoreList({ list: global.temporaryList });
    });

    afterEach(function () {
      datastores = null;
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
          <input type="checkbox" class="record__checkbox" />
          <input type="checkbox" class="select-all__checkbox" />
        </div>
      `;

      // Create sinon stubs for the action methods
      actions = {
        actionsPanelText: sinon.spy(),
        disableActionTabs: sinon.spy(),
        displayCSLData: sinon.spy(),
        regenerateCitations: sinon.spy(),
        selectAllCheckboxState: sinon.spy(),
        updateSelectedCount: sinon.spy()
      };

      args = { actions, list: global.temporaryList };

      // Initialize the function with the stubbed actions
      handleSelectionChange(args);

      listElement = () => {
        return document.querySelector('.list');
      };

      checkbox = () => {
        return document.querySelector('.record__checkbox');
      };

      selectAll = () => {
        return document.querySelector('input[type="checkbox"].select-all__checkbox');
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
        displayCSLData: sinon.stub()
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
    let list = null;
    let listFunctions = null;
    let args = null;

    beforeEach(function () {
      // Create spies
      list = { ...global.temporaryList };
      listFunctions = {
        createDatastoreList: sinon.stub(),
        getDatastores: sinon.stub().returns(getDatastores({ list })),
        initializeNonEmptyListFunctions: sinon.stub(),
        toggleListElements: sinon.stub()
      };
      args = {
        list,
        listFunctions
      };

      // Check that the list is not empty
      expect(getDatastores({ list: args.list }), 'the temporary list should not be empty').to.not.be.empty;

      // Call the function
      temporaryList(args);
    });

    afterEach(function () {
      list = null;
      listFunctions = null;
      args = null;
    });

    it('should call `toggleListElements` with the correct arguments', function () {
      // Check that `toggleListElements` was called with stubs
      expect(listFunctions.toggleListElements.calledOnceWithExactly({ list: args.list }), '`toggleListElements` should have been called with the correct arguments').to.be.true;
    });

    it('should call `createDatastoreList` with the correct arguments', function () {
      // Check that `createDatastoreList` was called with stubs
      expect(listFunctions.createDatastoreList.calledOnceWithExactly({ list: args.list }), '`createDatastoreList` should have been called with the correct arguments').to.be.true;
    });

    it('should call `getDatastores` with the correct arguments', function () {
      // Check that `getDatastores` was called with stubs
      expect(listFunctions.getDatastores.calledOnceWithExactly({ list: args.list }), '`getDatastores` should have been called with the correct arguments').to.be.true;
    });

    describe('initializeNonEmptyListFunctions()', function () {
      it('should be called if the temporary list is not empty', function () {
        // Check that `initializeNonEmptyListFunctions` was called
        expect(listFunctions.initializeNonEmptyListFunctions.calledOnce, '`initializeNonEmptyListFunctions` should have been called').to.be.true;
      });

      it('should not be called if the temporary list is empty', function () {
        // Check that the list is empty
        args.list = { ...defaultTemporaryList };
        expect(getDatastores({ list: args.list }), 'the temporary list should be empty').to.be.empty;

        // Call the function again
        temporaryList(args);

        // Check that `initializeNonEmptyListFunctions` was not called
        expect(listFunctions.initializeNonEmptyListFunctions.calledOnce, '`initializeNonEmptyListFunctions` should have not been called').to.be.false;
      });
    });
  });
});
