import {
  addToFormSubmit,
  addToFormsUI,
  addToList,
  defaultTemporaryList,
  getTemporaryList,
  initializeAddToList,
  inTemporaryList,
  setTemporaryList,
  temporaryListCount
} from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import { expect } from 'chai';
import sinon from 'sinon';

const listName = 'temporaryList';
const addToClass = 'list__add-to';
let formsHTML = '';
Object.keys(global.temporaryList).forEach((datastore) => {
  Object.keys(global.temporaryList[datastore]).forEach((recordId) => {
    formsHTML += `<form action="/${datastore}/record/${recordId}/brief" method="post" class="${addToClass}" data-record-id="${recordId}" data-record-datastore="${datastore}"></form>`;
  });
});

describe('add to', function () {
  let getForms = null;
  let getFormCount = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="fake-form" method="post"></form>
      ${formsHTML}
    `;

    getForms = () => {
      return document.querySelectorAll(`.${addToClass}`);
    };

    getFormCount = () => {
      return getForms().length;
    };
  });

  afterEach(function () {
    getForms = null;
    getFormCount = null;
  });

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

  describe('addToFormSubmit()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        handleSubmit: sinon.stub(),
        list: { id: 'test-list' }
      };

      // Call the function
      addToFormSubmit(args);
    });

    afterEach(function () {
      args = null;
    });

    it(`should call \`event.preventDefault()\` and \`handleSubmit\` with the correct arguments when a \`.${addToClass}\` form is submitted`, function () {
      // Simulate submit event
      const event = new window.Event('submit', { bubbles: true, cancelable: true });
      sinon.spy(event, 'preventDefault');

      // Submit the first form
      const [form] = getForms();
      form.dispatchEvent(event);

      // Check that `event.preventDefault()` was called
      expect(event.preventDefault.calledOnce, '`event.preventDefault()` should have been called').to.be.true;

      // Check that `handleSubmit` was only called once
      expect(args.handleSubmit.calledOnce, '`handleSubmit` should have only been called once').to.be.true;

      // Check that `handleSubmit` received the correct arguments
      expect(args.handleSubmit.firstCall.args[0], '`handleSubmit` should have received the correct arguments').to.deep.equal({ form, list: args.list });
    });

    it(`should not call \`handleSubmit\` when the submitted form lacks \`.${addToClass}\``, function () {
      // Simulate submit event
      const event = new window.Event('submit', { bubbles: true, cancelable: true });
      sinon.spy(event, 'preventDefault');

      // Submit the fake form
      document.querySelector('form.fake-form').dispatchEvent(event);

      // Check that `event.preventDefault()` was not called
      expect(event.preventDefault.notCalled, '`event.preventDefault()` should not have been called').to.be.true;

      // Check that `handleSubmit` was only called once
      expect(args.handleSubmit.notCalled, '`handleSubmit` should not have been called').to.be.true;
    });

    it(`should work with multiple \`.${addToClass}\` form submissions`, function () {
      // Submit every form
      getForms().forEach((form) => {
        form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
      });

      // Check if `handleSubmit` has been called for every form
      expect(args.handleSubmit.callCount, '`handleSubmit` should have been called for every submitted form').to.equal(getFormCount());
    });

    it('should do nothing if no submit event is fired', function () {
      // No submit event dispatched
      expect(args.handleSubmit.notCalled, '`handleSubmit` should have not been called if no form was submitted').to.be.true;
    });
  });

  describe('addToFormsUI()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        list: { id: '123' },
        updateResult: sinon.stub()
      };
    });

    afterEach(function () {
      args = null;
    });

    it(`should call \`updateResult\` for each \`.${addToClass}\` element`, function () {
      // Call the function
      addToFormsUI(args);

      // Check if `updateResult` has been called for every number of form
      expect(args.updateResult.callCount, '`updateResult` should have never been called if no forms exist').to.equal(getFormCount());

      getForms().forEach((form, index) => {
        // Check that each call had the correct arguments
        expect(args.updateResult.getCall(index).args[0]).to.deep.equal({ form, list: args.list });
      });
    });

    it(`should do nothing if there are no \`.${addToClass}\` elements`, function () {
      // Remove all forms
      getForms().forEach((forms) => {
        return forms.remove();
      });

      // Check that no forms exist
      expect(getFormCount(), 'there should not be any forms').to.equal(0);

      // Call the function again
      addToFormsUI(args);

      // Check that `updateResult` was never called
      expect(args.updateResult.callCount, '`updateResult` should have never been called if no forms exist').to.equal(getFormCount());
    });
  });

  describe('initializeAddToList()', function () {
    let addToFuncs = null;
    let list = null;

    beforeEach(function () {
      addToFuncs = {
        addToFormSubmit: sinon.stub(),
        addToFormsUI: sinon.stub()
      };
      list = { id: 'test-list' };

      // Call the function
      initializeAddToList({ addToFuncs, list });
    });

    afterEach(function () {
      addToFuncs = null;
      list = null;
    });

    it('should call each function in `addToFuncs` with the correct argument', function () {
      Object.keys(addToFuncs).forEach((addToFunc) => {
        expect(addToFuncs[addToFunc].calledOnceWithExactly({ list }), `\`${addToFunc}\` should have been called with the \`list\` argument`).to.be.true;
      });
    });
  });

  describe('addToList()', function () {
    let mockList = null;
    let initializeAddToButtonStub = null;

    beforeEach(function () {
      mockList = { foo: 'bar' };
      initializeAddToButtonStub = sinon.stub();

      // Call the function
      addToList(mockList, initializeAddToButtonStub);
    });

    it('should call `initializeAddToButton`', function () {
      // Check that `initializeAddToButton` was called
      expect(initializeAddToButtonStub.calledOnce, '`initializeAddToButton` should have only been called once').to.be.true;
    });

    it('should provided the list argument for `initializeAddToButton`', function () {
      // Check that the arguments provided equal to the list
      expect(initializeAddToButtonStub.firstCall.args[0], '`initializeAddToButton` should have received the argument of the provided list').to.deep.equal({ list: mockList });
    });
  });
});
