import {
  defaultTemporaryList,
  getDatastores,
  getSessionStorage,
  inTemporaryList,
  setSessionStorage,
  temporaryList,
  toggleListElements,
  viewingTemporaryList
} from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

describe('layout', function () {
  let getElement = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list">
        <input type="checkbox" class="record__checkbox" />
        <input type="checkbox" class="select-all__checkbox" />
      </div>
    `;

    getElement = () => {
      return document.querySelector('.list');
    };
  });

  afterEach(function () {
    getElement = null;
  });

  describe('defaultTemporaryList', function () {
    it('should be an object', function () {
      expect(defaultTemporaryList, '`defaultTemporaryList` should be an object').to.be.an('object');
    });

    it('should contain all datastores with empty objects', function () {
      Object.keys(defaultTemporaryList).forEach((datastore) => {
        expect(['articles', 'catalog', 'databases', 'everything', 'guidesandmore', 'onlinejournals'].includes(datastore), `\`${datastore}\` should be a valid datastore`).to.be.true;
        expect(defaultTemporaryList[datastore], `\`${datastore}\` should be an empty object`).to.be.an('object').that.is.empty;
      });
    });
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
    let getDatastoresStub = null;
    let removeEmptyListMessageSpy = null;
    let removeEmptyDatastoreSectionsSpy = null;
    let removeListResultsSpy = null;
    let args = null;

    beforeEach(function () {
      getDatastoresStub = sinon.stub().callsFake(({ list }) => {
        return getDatastores({ list });
      });
      removeEmptyListMessageSpy = sinon.spy();
      removeEmptyDatastoreSectionsSpy = sinon.spy();
      removeListResultsSpy = sinon.spy();
      args = {
        datastores: getDatastoresStub,
        list: global.temporaryList,
        removeEmptyMessage: removeEmptyListMessageSpy,
        removeLists: removeEmptyDatastoreSectionsSpy,
        removeResults: removeListResultsSpy
      };
    });

    afterEach(function () {
      getDatastoresStub = null;
      removeEmptyListMessageSpy = null;
      removeEmptyDatastoreSectionsSpy = null;
      removeListResultsSpy = null;
      args = null;
    });

    describe('non-empty temporary list', function () {
      beforeEach(function () {
        // Check that the temporary list is not empty
        expect(args.datastores({ list: args.list }).length, 'the temporary list should not be empty').to.be.above(0);

        // Call the function
        toggleListElements(args);
      });

      it('should call `getDatastores` with the correct arguments', function () {
        // Check that `getDatastores` was called
        expect(getDatastoresStub.calledWithExactly({ list: args.list }), '`getDatastores` should have been called with the correct arguments').to.be.true;
      });

      it('should call `removeEmptyListMessage`', function () {
        // Check that `removeEmptyListMessage` was called
        expect(removeEmptyListMessageSpy.calledOnce, '`removeEmptyListMessage` should have been called once').to.be.true;
      });

      it('should call `removeEmptyDatastoreSections` with the correct arguments', function () {
        // Check that `removeEmptyDatastoreSections` was called
        expect(removeEmptyDatastoreSectionsSpy.calledOnceWithExactly({ datastores: args.datastores({ list: args.list }) }), '`removeEmptyDatastoreSections` should have been called with the correct arguments').to.be.true;
      });

      it('should not call `removeResults`', function () {
        // Check that `removeResults` was not called
        expect(removeListResultsSpy.notCalled, '`removeResults` should not have been called').to.be.true;
      });
    });

    describe('empty temporary list', function () {
      beforeEach(function () {
        // Check that the temporary list is empty
        args.list = defaultTemporaryList;
        expect(args.datastores({ list: args.list }).length, 'the temporary list should be empty').to.equal(0);

        // Call the function
        toggleListElements(args);
      });

      it('should call `getDatastores` with the correct arguments', function () {
        // Check that `getDatastores` was called
        expect(getDatastoresStub.calledWithExactly({ list: args.list }), '`getDatastores` should have been called with the correct arguments').to.be.true;
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

  describe('temporaryList()', function () {
    let getDatastoresStub = null;
    let initializeActionsSpy = null;
    let handleActionsPanelChangeSpy = null;
    let selectAllSpy = null;
    let toggleListElementsSpy = null;
    let updateResultsListsSpy = null;
    let args = null;

    beforeEach(function () {
      getDatastoresStub = sinon.stub().callsFake(({ list }) => {
        return getDatastores({ list });
      });
      initializeActionsSpy = sinon.spy();
      handleActionsPanelChangeSpy = sinon.spy();
      selectAllSpy = sinon.spy();
      toggleListElementsSpy = sinon.spy();
      updateResultsListsSpy = sinon.spy();
      args = {
        actionsPanel: initializeActionsSpy,
        datastores: getDatastoresStub,
        handleActionsChange: handleActionsPanelChangeSpy,
        initializeSelectAll: selectAllSpy,
        list: global.temporaryList,
        toggleElements: toggleListElementsSpy,
        updateResults: updateResultsListsSpy
      };
    });

    afterEach(function () {
      getDatastoresStub = null;
      initializeActionsSpy = null;
      handleActionsPanelChangeSpy = null;
      selectAllSpy = null;
      toggleListElementsSpy = null;
      updateResultsListsSpy = null;
      args = null;
    });

    describe('non-empty list', function () {
      beforeEach(function () {
        // Check that the list is not empty
        expect(getDatastores({ list: args.list }), 'the temporary list should not be empty').to.not.be.empty;

        // Call the function
        temporaryList(args);
      });

      it('should call `toggleListElements` with the correct arguments', function () {
        expect(toggleListElementsSpy.calledOnceWithExactly({ list: args.list }), '`toggleListElements` should have been called with the correct arguments').to.be.true;
      });

      it('should call `updateResultsLists` with the correct arguments', function () {
        expect(updateResultsListsSpy.calledOnceWithExactly({ list: args.list }), '`updateResultsLists` should have been called with the correct arguments').to.be.true;
      });

      it('should call `getDatastores` with the correct arguments', function () {
        expect(getDatastoresStub.calledOnceWithExactly({ list: args.list }), '`getDatastores` should have been called with the correct arguments').to.be.true;
      });

      it('should call `initializeActions` with the correct arguments', function () {
        expect(initializeActionsSpy.calledOnceWithExactly({ list: args.list }), '`initializeActions` should have been called with the correct arguments').to.be.true;
      });

      it('should call `selectAll` with the correct arguments', function () {
        expect(selectAllSpy.calledOnceWithExactly(), '`selectAll` should have been called with the correct arguments').to.be.true;
      });

      it('should call `handleActionsPanelChange` with the correct arguments', function () {
        expect(handleActionsPanelChangeSpy.calledOnceWithExactly({ element: getElement() }), '`handleActionsPanelChange` should have been called with the correct arguments').to.be.true;
      });
    });

    describe('empty list', function () {
      beforeEach(function () {
        // Check that the list is empty
        args.list = { ...defaultTemporaryList };
        expect(getDatastores({ list: args.list }), 'the temporary list should be empty').to.be.empty;

        // Call the function
        temporaryList(args);
      });

      it('should call `toggleListElements` with the correct arguments', function () {
        expect(toggleListElementsSpy.calledOnceWithExactly({ list: args.list }), '`toggleListElements` should have been called with the correct arguments').to.be.true;
      });

      it('should call `updateResultsLists` with the correct arguments', function () {
        expect(updateResultsListsSpy.calledOnceWithExactly({ list: args.list }), '`updateResultsLists` should have been called with the correct arguments').to.be.true;
      });

      it('should call `getDatastores` with the correct arguments', function () {
        expect(getDatastoresStub.calledOnceWithExactly({ list: args.list }), '`getDatastores` should have been called with the correct arguments').to.be.true;
      });

      it('should not call `initializeActions` if the temporary list is empty', function () {
        expect(initializeActionsSpy.notCalled, '`initializeActions` should not have been called').to.be.true;
      });

      it('should not call `selectAll` if the temporary list is empty', function () {
        expect(selectAllSpy.notCalled, '`selectAll` should not have been called').to.be.true;
      });

      it('should not call `handleActionsPanelChange` if the temporary list is empty', function () {
        expect(handleActionsPanelChangeSpy.notCalled, '`handleActionsPanelChange` should not have been called').to.be.true;
      });
    });
  });
});
