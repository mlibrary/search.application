import {
  defaultTemporaryList,
  getTemporaryList,
  inTemporaryList,
  setTemporaryList,
  temporaryListCount
} from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import { expect } from 'chai';
import sinon from 'sinon';

const listName = 'temporaryList';

describe('add to', function () {
  describe('getTemporaryList()', function () {
    let getTemporaryListStub = null;

    beforeEach(function () {
      global.sessionStorage = { getItem: sinon.stub() };
      getTemporaryListStub = global.sessionStorage.getItem;

      // Reset the stub before each test
      getTemporaryListStub.reset();
    });

    it(`should call \`sessionStorage.getItem\` with \`${listName}\``, function () {
      // Make sure `sessionStorage` is defined
      getTemporaryListStub.returns('');

      // Call the function
      getTemporaryList();

      // Check that `temporaryList` was called
      expect(getTemporaryListStub.calledOnceWithExactly(listName), `\`${listName}\` should have been called`).to.be.true;
    });

    it('should parse and return a string value from `sessionStorage.getItem`', function () {
      // Create a string value
      const string = 'example';
      expect(string, 'the example should be a string').to.be.a('string');

      // Define `sessionStorage` with the string
      getTemporaryListStub.withArgs(listName).returns(`"${string}"`);

      // Assign the functiom to a variable
      const result = getTemporaryList();

      // Check that the result returns the string value
      expect(result, 'the result should have returned a string value').to.equal(string);
    });

    it('should parse and return an object from `sessionStorage.getItem`', function () {
      // Use an object value
      expect(global.temporaryList, 'the example should be an object').to.be.an('object');

      // Define `sessionStorage` with the object
      getTemporaryListStub.withArgs(listName).returns(JSON.stringify(global.temporaryList));

      // Assign the functiom to a variable
      const result = getTemporaryList();

      // Check that the result returns parsed
      expect(result, 'the returned object should have been parsed').to.deep.equal(global.temporaryList);
    });

    it('should return the default object if `sessionStorage.getItem` returns `null`', function () {
      // Define `sessionStorage` with `null`
      getTemporaryListStub.withArgs(listName).returns(null);

      // Assign the functiom to a variable
      const result = getTemporaryList();

      // Check that the result returns the predefined object
      expect(result, 'the result should have resturned the predefined object').to.deep.equal(defaultTemporaryList);
    });
  });

  describe('setTemporaryList()', function () {
    let setTemporaryListStub = null;

    beforeEach(function () {
      global.sessionStorage = { setItem: sinon.stub() };
      setTemporaryListStub = global.sessionStorage.setItem;

      // Reset the stub before each test
      setTemporaryListStub.reset();
    });

    it(`should stringify and set the value in \`sessionStorage\` under \`${listName}\``, function () {
      // Call the function
      setTemporaryList(global.temporaryList);

      // Check that a stringified value was set under `temporaryList`
      expect(setTemporaryListStub.calledOnceWithExactly(listName, JSON.stringify(global.temporaryList)), `the value should have been stringified under \`${listName}\``).to.be.true;
    });

    it('should handle string values too', function () {
      // Create a string value
      const string = 'example';
      expect(string, 'the example should be a string').to.be.a('string');

      // Call the function
      setTemporaryList(string);

      // Check that a stringified value was set under `temporaryList`
      expect(setTemporaryListStub.calledOnceWithExactly(listName, JSON.stringify(string)), `the string value should have returned under \`${listName}\``).to.be.true;
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

  describe('temporaryListCount()', function () {
    let list = null;

    beforeEach(function () {
      list = { ...global.temporaryList };
    });

    afterEach(function () {
      list = null;
    });

    it('should return the sum of all record IDs in each datastore', function () {
      // Check that the count is not 0
      expect(temporaryListCount(list), '`temporaryListCount()` should have more than 0').to.equal(5);
    });

    it('should return `0` if the list is empty', function () {
      // Assign list to the default list
      list = defaultTemporaryList;

      // Check that the count is now 0
      expect(temporaryListCount(list), '`temporaryListCount()` should be 0').to.equal(0);
    });
  });
});
