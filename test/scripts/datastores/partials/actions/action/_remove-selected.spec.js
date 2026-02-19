import {
  deleteSelectedRecords,
  deleteSelectedRecordsTest,
  displayRemoveSelectedAction,
  getRemoveSelectedButton,
  removeSelected,
  removeSelectedAction
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_remove-selected.js';
import { filterSelectedRecords, splitCheckboxValue } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { getTemporaryList, nonEmptyDatastores, viewingTemporaryList } from '../../../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';

let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `
      <div class="record__container" data-record-id="${recordId}" data-record-datastore="${datastore}">
        <input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}>
      </div>
    `;
  });
});

describe('remove selected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button id="actions__remove-selected">Remove selected</button>
      <div id="actions__remove-selected--tabpanel">
        <button class="action__remove-selected">Remove from My Temporary List</button>
      </div>
      ${temporaryListHTML}
    `;

    // Set a temporary list in session storage
    global.sessionStorage = window.sessionStorage;
    global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));
  });

  afterEach(function () {
    // Clean up session storage
    delete global.sessionStorage;
  });

  describe('getRemoveSelectedButton()', function () {
    it('should return the remove selected button element', function () {
      expect(getRemoveSelectedButton()).to.deep.equal(document.querySelector('#actions__remove-selected--tabpanel button.action__remove-selected'));
    });
  });

  describe('deleteSelectedRecordsTest()', function () {
    let toggleAddedClassSpy = null;
    let splitCheckboxValueStub = null;
    let args = null;

    beforeEach(function () {
      toggleAddedClassSpy = sinon.spy();
      splitCheckboxValueStub = sinon.stub();
      splitCheckboxValueStub.callsFake(({ value }) => {
        return splitCheckboxValue({ value });
      });
      args = {
        checkboxValues: filterSelectedRecords(),
        list: global.temporaryList,
        removeClass: toggleAddedClassSpy,
        splitValue: splitCheckboxValueStub
      };

      // Check that there are selected records to test
      expect(args.checkboxValues.length, 'there should be selected records to test').to.be.greaterThan(0);
    });

    afterEach(function () {
      toggleAddedClassSpy = null;
      splitCheckboxValueStub = null;
      args = null;
    });

    it('should call `splitCheckboxValue` function with the correct arguments for each selected record', function () {
      // Call the function
      deleteSelectedRecordsTest({ ...args, splitValue: splitCheckboxValueStub });

      // Check that the spy was called with the correct arguments for each selected record
      args.checkboxValues.forEach((value) => {
        expect(splitCheckboxValueStub.calledWithExactly({ value }), `splitCheckboxValue should be called with the correct arguments for record value: ${value}`).to.be.true;
      });
    });

    it('should call `toggleAddedClass` function with the correct arguments for each selected record', function () {
      // Call the function
      deleteSelectedRecordsTest(args);

      // Check that the spy was called with the correct arguments for each selected record
      args.checkboxValues.forEach((value) => {
        // Get the record's datastore and ID
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        // Checl that `toggleAddedClass` was called with the correct arguments
        expect(toggleAddedClassSpy.calledWithExactly({ isAdded: false, recordDatastore, recordId }), `toggleAddedClass should be called with the correct arguments for record value: ${value}`).to.be.true;
      });
    });

    it('should return an object', function () {
      // Call the function
      const result = deleteSelectedRecordsTest(args);

      // Check that the result is an object
      expect(result).to.be.an('object');
    });

    it('should return an updated list object with the selected records removed', function () {
      // Call the function
      const updatedList = deleteSelectedRecordsTest(args);

      // Loop through the selected record values
      args.checkboxValues.forEach((value) => {
        // Get the record's datastore and ID
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        // Check that the updated list no longer contains the removed record
        expect(Object.keys(updatedList[recordDatastore]).includes(recordId), 'the updated list should no longer contain the record that is checked').to.be.false;
      });
    });
  });

  describe('displayRemoveSelectedAction()', function () {
    let inTemporaryListSpy = null;
    let splitCheckboxValueStub = null;
    let toggleTabDisplaySpy = null;
    let args = null;

    beforeEach(function () {
      inTemporaryListSpy = sinon.spy();
      splitCheckboxValueStub = sinon.stub().returns((checkbox) => {
        return splitCheckboxValue({ value: checkbox.value });
      });
      toggleTabDisplaySpy = sinon.spy();

      args = {
        checkedValues: filterSelectedRecords(),
        inList: inTemporaryListSpy,
        list: global.temporaryList,
        splitValue: splitCheckboxValue,
        toggleTab: toggleTabDisplaySpy
      };

      // Check that there is at least one checked checkbox value to test with
      expect(args.checkedValues.length, 'there should be at least one checked checkbox value to test with').to.be.greaterThan(0);

      // Call the function
      displayRemoveSelectedAction(args);
    });

    afterEach(function () {
      inTemporaryListSpy = null;
      splitCheckboxValueStub = null;
      toggleTabDisplaySpy = null;
      args = null;
    });

    it('should call `splitCheckboxValue` at least once with the correct arguments', function () {
      // Call the function with the stubbed `splitValue`
      displayRemoveSelectedAction({ ...args, splitValue: splitCheckboxValueStub });

      // Check that `splitCheckboxValue` was called at least once with the correct arguments
      expect(splitCheckboxValueStub.calledWithExactly({ value: args.checkedValues[0] }), '`splitCheckboxValue` should be called with the correct arguments').to.be.true;
    });

    it('should call `inTemporaryList` at least once with the correct arguments', function () {
      // Get the expected arguments for the first checked checkbox value
      const { recordDatastore, recordId } = splitCheckboxValue({ value: args.checkedValues[0] });

      // Check that `inTemporaryList` was called at least once with the correct arguments
      expect(inTemporaryListSpy.calledWithExactly({ list: args.list, recordDatastore, recordId }), '`inTemporaryList` should be called with the correct arguments').to.be.true;
    });

    it('should call `toggleTab` with the correct arguments', function () {
      // Check if all checked values are already in the temporary list
      const showTab = args.checkedValues.every((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        return inTemporaryListSpy({ list: args.list, recordDatastore, recordId });
      });

      // Check that `toggleTab` was called with the correct arguments
      expect(toggleTabDisplaySpy.calledWithExactly({ id: 'actions__remove-selected', show: showTab }), '`toggleTab` should be called with the correct arguments for the `remove-selected` tab').to.be.true;
    });
  });

  describe('deleteSelectedRecords()', function () {
    let setListSpy = null;
    let args = null;

    beforeEach(function () {
      setListSpy = sinon.spy();
      args = {
        list: getTemporaryList(),
        setList: setListSpy
      };
    });

    afterEach(function () {
      setListSpy = null;
      args = null;
    });

    it('should delete the selected record(s) from session storage', function () {
      // Check that there are selected records to test
      expect(filterSelectedRecords().length, 'there should be selected records to test').to.be.greaterThan(0);

      // Check that the temporary list contains the record(s) that are checked
      filterSelectedRecords().forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should contain the record that is checked').to.be.true;
      });

      // Call the function
      deleteSelectedRecords(args);

      // Check that the temporary list no longer contains the removed record(s)
      filterSelectedRecords().forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should no longer contain the record that is checked').to.be.false;
      });
    });

    it('should not delete unselected record(s) from session storage', function () {
      // Get unselected records
      const unselectedRecords = Array.from(document.querySelectorAll('input[type="checkbox"].list__item--checkbox:not(:checked)')).map((checkbox) => {
        return checkbox.value;
      });

      // Check that there are unselected records to test
      expect(unselectedRecords.length, 'there should be unselected records to test').to.be.greaterThan(0);

      // Check that the temporary list contains the unselected record(s)
      unselectedRecords.forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should contain the unselected record').to.be.true;
      });

      // Call the function
      deleteSelectedRecords(args);

      // Check that the temporary list still contains the unselected record(s)
      unselectedRecords.forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should still contain the unselected record').to.be.true;
      });
    });

    it('should call `setList` function to update session storage', function () {
      // Call the function
      deleteSelectedRecords(args);

      // Check that the spy was called
      expect(setListSpy.calledOnce, '`setList` function should be called once').to.be.true;
    });
  });

  describe('removeSelectedAction()', function () {
    let deleteRecordsSpy = null;
    let reloadPageSpy = null;
    let args = null;

    beforeEach(function () {
      deleteRecordsSpy = sinon.spy();
      reloadPageSpy = sinon.spy();
      args = {
        button: getRemoveSelectedButton(),
        deleteRecords: deleteRecordsSpy,
        list: getTemporaryList(),
        reloadPage: reloadPageSpy
      };

      // Call the function
      removeSelectedAction(args);

      // Click the button
      args.button.click();
    });

    afterEach(function () {
      deleteRecordsSpy = null;
      reloadPageSpy = null;
      args = null;
    });

    it('should call `deleteRecords` function with the correct arguments when the button is clicked', function () {
      // Check that the spy was called with the correct argument
      expect(deleteRecordsSpy.calledWithExactly({ list: args.list }), '`deleteRecords` function should be called with the correct arguments').to.be.true;
    });

    describe('reloadPage', function () {
      it('should not call `reloadPage` function if not currently viewing My Temporary List', function () {
        // Check that Temporary List is not being viewed
        expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

        // Check that the spy was not called
        expect(reloadPageSpy.notCalled, '`reloadPage` function should not be called if not currently viewing My Temporary List').to.be.true;
      });

      it('should call `reloadPage` function when the button is clicked if currently viewing My Temporary List', function () {
        // Save the original window object
        const originalWindow = global.window;

        // Setup JSDOM with an updated URL
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
          url: 'http://localhost/everything/list'
        });

        // Override the global window object
        global.window = dom.window;

        // Check that Temporary List is being viewed
        expect(viewingTemporaryList(), 'the current pathname should be `/everything/list`').to.be.true;

        // Call the function again
        removeSelectedAction(args);

        // Click the button again
        args.button.click();

        // Check that the spy was called
        expect(reloadPageSpy.calledOnce, 'reloadPage function should be called once').to.be.true;

        // Restore the original window object
        global.window = originalWindow;
      });
    });
  });

  describe('removeSelected()', function () {
    let removeSelectedActionSpy = null;
    let displayRemoveSelectedActionSpy = null;
    let args = null;

    beforeEach(function () {
      removeSelectedActionSpy = sinon.spy();
      displayRemoveSelectedActionSpy = sinon.spy();
      args = {
        list: getTemporaryList(),
        removeAction: removeSelectedActionSpy,
        toggleAction: displayRemoveSelectedActionSpy
      };

      // Call the function
      removeSelected(args);
    });

    afterEach(function () {
      removeSelectedActionSpy = null;
      displayRemoveSelectedActionSpy = null;
      args = null;
    });

    it('should call `displayRemoveSelectedAction` function with the correct arguments', function () {
      // Check that the spy was called with the correct argument
      expect(displayRemoveSelectedActionSpy.calledWithExactly({ list: args.list }), '`displayRemoveSelectedAction` function should be called with the correct arguments').to.be.true;
    });

    it('should call `removeSelectedAction` function with the correct arguments', function () {
      // Check that the spy was called with the correct argument
      expect(removeSelectedActionSpy.calledWithExactly({ list: args.list }), '`removeSelectedAction` function should be called with the correct arguments').to.be.true;
    });
  });
});
