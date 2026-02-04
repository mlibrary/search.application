import {
  addToFormSubmit,
  addToFormsUI,
  addToList,
  fetchAndAddRecord,
  handleFormSubmit,
  initializeAddToList,
  removeRecordFromList,
  updateResultUI
} from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import { expect } from 'chai';
import sinon from 'sinon';

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

  describe('updateResultUI()', function () {
    let form = null;
    let recordDatastore = null;
    let recordId = null;
    let list = null;
    let updateUI = null;

    beforeEach(function () {
      // Grab the first form
      [form] = getForms();
      ({ recordDatastore, recordId } = form.dataset);
      list = { ...global.temporaryList };
      updateUI = {
        inTemporaryList: sinon.stub(),
        toggleBanner: sinon.stub(),
        toggleContainerClass: sinon.stub(),
        updateButtonUI: sinon.stub()
      };

      // Call the function
      updateResultUI({ form, list, updateUI });
    });

    afterEach(function () {
      form = null;
      recordDatastore = null;
      recordId = null;
      list = null;
      updateUI = null;
    });

    it('should call `inTemporaryList` with the correct arguments', function () {
      // Check that `inTemporaryList` was called with the correct arguments
      expect(updateUI.inTemporaryList.calledOnceWithExactly({ list, recordDatastore, recordId }), '`inTemporaryList` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleContainerClass` with the correct arguments', function () {
      const isAdded = updateUI.inTemporaryList.firstCall.returnValue;

      // Check that `toggleContainerClass` was called with the correct arguments
      expect(updateUI.toggleContainerClass.calledOnceWithExactly({ isAdded, recordDatastore, recordId }), '`toggleContainerClass` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateButtonUI` with the correct arguments', function () {
      const isAdded = updateUI.inTemporaryList.firstCall.returnValue;

      // Check that `updateButtonUI` was called with the correct arguments
      expect(updateUI.updateButtonUI.calledOnceWithExactly({ button: form.querySelector('button'), isAdded }), '`updateButtonUI` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleBanner`', function () {
      // Check that `toggleBanner` was called
      expect(updateUI.toggleBanner.calledOnce, '`toggleBanner` should have been called once').to.be.true;
    });
  });

  describe('removeRecordFromList()', function () {
    let list = null;
    let recordDatastore = null;
    let recordId = null;
    let args = null;

    beforeEach(function () {
      list = { datastore: { recordId: {} } };
      [recordDatastore] = Object.keys(list);
      [recordId] = Object.keys(list[recordDatastore]);

      args = { list, recordDatastore, recordId };

      // Check that the record exists in the list before testing
      expect(list[recordDatastore][recordId], 'the record should exist in the list before testing').to.not.be.null;
    });

    afterEach(function () {
      list = null;
      recordDatastore = null;
      recordId = null;
      args = null;
    });

    it('should remove the record from the datastore in the list', function () {
      // Assign the result
      const updatedList = removeRecordFromList(args);

      // Check that the record no longer exists in the udated list
      expect(updatedList[recordDatastore][recordId], 'the record should no longer exist in the list').to.be.undefined;
    });

    it('should return the original list if the record does not exist in the datastore', function () {
      // Assign the result
      const updatedList = removeRecordFromList({ ...args, recordId: 'non-existent' });

      // Check that the list remains the same
      expect(updatedList, 'the list should remain the same').to.deep.equal(list);
    });

    it('should return the original list if the datastore does not exist in the list', function () {
      // Assign the result
      const updatedList = removeRecordFromList({ ...args, recordDatastore: 'non-existent' });

      // Check that the list remains the same
      expect(updatedList, 'the list should remain the same').to.deep.equal(list);
    });
  });

  describe('fetchAndAddRecord()', function () {
    let fetchStub = null;
    let list = null;
    let recordDatastore = null;
    let recordId = null;
    let args = null;

    beforeEach(function () {
      fetchStub = sinon.stub(global, 'fetch');
      list = { datastore: { recordId: {} } };
      [recordDatastore] = Object.keys(list);
      [recordId] = Object.keys(list[recordDatastore]);

      args = { list, recordDatastore, recordId, url: `/${recordDatastore}/record/${recordId}/brief` };
    });

    afterEach(function () {
      fetchStub.restore();
      list = null;
      recordDatastore = null;
      recordId = null;
      args = null;
    });

    it('should fetch the record and add it to the list', async function () {
      // Mock a successful fetch response
      const mockResponse = new Response(
        JSON.stringify({ data: 'record data' }),
        {
          headers: { 'Content-type': 'application/json' },
          status: 200
        }
      );
      fetchStub.resolves(mockResponse);

      // Call the function
      const updatedList = await fetchAndAddRecord(args);

      // Check that the record was added to the list
      expect(updatedList[recordDatastore][recordId], 'the record should have been added to the list').to.deep.equal({ data: 'record data' });
    });

    it('should return the original list if the fetch fails', async function () {
      // Mock a failed fetch response
      const mockResponse = new Response(null, { status: 404 });
      fetchStub.resolves(mockResponse);

      // Call the function
      const updatedList = await fetchAndAddRecord(args);

      // Check that the list remains unchanged
      expect(updatedList, 'the list should remain unchanged').to.deep.equal(list);
    });

    it('should return the original list if an error occurs during fetch', async function () {
      // Mock a fetch error
      fetchStub.rejects(new Error('Network error'));

      // Call the function
      const updatedList = await fetchAndAddRecord(args);

      // Check that the list remains unchanged
      expect(updatedList, 'the list should remain unchanged').to.deep.equal(list);
    });
  });

  describe('handleFormSubmit()', function () {
    let form = null;
    let list = null;
    let submitFuncs = null;
    let args = null;

    beforeEach(function () {
      // Grab the first form
      [form] = getForms();
      list = { ...global.temporaryList };
      submitFuncs = {
        fetchAndAddRecord: sinon.stub().resolves({}),
        inTemporaryList: sinon.stub().returns(true),
        removeRecordFromList: sinon.stub().returns({}),
        setTemporaryList: sinon.stub(),
        updateResultUI: sinon.stub()
      };

      args = { form, list, submitFuncs };
    });

    afterEach(function () {
      form = null;
      list = null;
      submitFuncs = null;
      args = null;
    });

    it('should call the appropriate functions no matter the record is in the list or not', async function () {
      // Call the function
      await handleFormSubmit(args);

      // Check that the appropriate functions were called
      ['inTemporaryList', 'setTemporaryList', 'updateResultUI'].forEach((func) => {
        expect(submitFuncs[func].calledOnce, `\`${func}\` should have been called once`).to.be.true;
      });
    });

    it('should call the appropriate function to remove a record if it is already in the list', async function () {
      // Call the function
      await handleFormSubmit(args);

      // Check that the appropriate function was called
      expect(submitFuncs.fetchAndAddRecord.notCalled, '`fetchAndAddRecord` should not have been called').to.be.true;

      // Check that the remove function was called
      expect(submitFuncs.removeRecordFromList.calledOnce, '`removeRecordFromList` should have been called once').to.be.true;
    });

    it('should call the appropriate function to add a record if it is not already in the list', async function () {
      // Create stubs for the submit functions
      submitFuncs.inTemporaryList = sinon.stub().returns(false);

      // Call the function
      await handleFormSubmit(args);

      // Check that the appropriate function was called
      expect(submitFuncs.fetchAndAddRecord.calledOnce, '`fetchAndAddRecord` should have been called once').to.be.true;

      // Check that the remove function was not called
      expect(submitFuncs.removeRecordFromList.notCalled, '`removeRecordFromList` should not have been called').to.be.true;
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
    let args = null;
    let initializeAddToButtonStub = null;

    beforeEach(function () {
      initializeAddToButtonStub = sinon.stub();
      args = {
        initializeAddToButton: initializeAddToButtonStub,
        list: { foo: 'bar' }
      };

      // Call the function
      addToList(args);
    });

    afterEach(function () {
      args = null;
      initializeAddToButtonStub = null;
    });

    it('should call `initializeAddToButton`', function () {
      // Check that `initializeAddToButton` was called
      expect(initializeAddToButtonStub.calledOnce, '`initializeAddToButton` should have only been called once').to.be.true;
    });

    it('should provided the list argument for `initializeAddToButton`', function () {
      // Check that the arguments provided equal to the list
      expect(initializeAddToButtonStub.firstCall.args[0], '`initializeAddToButton` should have received the argument of the provided list').to.deep.equal({ list: args.list });
    });
  });
});
