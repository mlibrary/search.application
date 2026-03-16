import {
  deleteSelectedRecords,
  getRemoveSelectedButton,
  handleRemoveSelectedClick,
  removeSelected,
  removeSelectedAction
} from '../../../../../../../assets/scripts/datastores/partials/actions/action/toggle-selected/_remove.js';
import { filterSelectedRecords, splitCheckboxValue } from '../../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/header/_checkbox.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

let temporaryListHTML = '';
getDatastores({ list: global.temporaryList }).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `
      <div class="record__container" data-record-id="${recordId}" data-record-datastore="${datastore}">
        <input type="checkbox" class="record__checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}>
      </div>
    `;
  });
});

describe('remove selected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button id="actions__toggle-selected">Remove selected</button>
      <div id="actions__toggle-selected--tabpanel">
        <button class="action__toggle-selected--remove">Remove from My Temporary List</button>
      </div>
      ${temporaryListHTML}
    `;
  });

  describe('getRemoveSelectedButton()', function () {
    it('should return the remove selected button element', function () {
      expect(getRemoveSelectedButton(), 'getRemoveSelectedButton() should return the correct button').to.deep.equal(document.querySelector('#actions__toggle-selected--tabpanel button.action__toggle-selected--remove'));
    });
  });

  describe('deleteSelectedRecords()', function () {
    let toggleAddedClassSpy = null;
    let splitCheckboxValueStub = null;
    let args = null;
    let newList = null;

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

      // Call the function
      newList = deleteSelectedRecords(args);
    });

    afterEach(function () {
      toggleAddedClassSpy = null;
      splitCheckboxValueStub = null;
      args = null;
      newList = null;
    });

    it('should call `splitCheckboxValue` function with the correct arguments for each selected record', function () {
      // Loop through the selected record values
      args.checkboxValues.forEach((value) => {
        // Check that `splitCheckboxValue` was called with the correct arguments
        expect(splitCheckboxValueStub.calledWithExactly({ value }), `\`splitCheckboxValue\` should be called with the correct arguments for record value: ${value}`).to.be.true;
      });
    });

    it('should call `toggleAddedClass` function with the correct arguments for each selected record', function () {
      // Loop through the selected record values
      args.checkboxValues.forEach((value) => {
        // Get the record's datastore and ID
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        // Check that `toggleAddedClass` was called with the correct arguments
        expect(toggleAddedClassSpy.calledWithExactly({ isAdded: false, recordDatastore, recordId }), `\`toggleAddedClass\` should be called with the correct arguments for record value: ${value}`).to.be.true;
      });
    });

    it('should return an object', function () {
      expect(newList).to.be.an('object');
    });

    it('should return an updated list object with the selected records removed', function () {
      // Loop through the selected record values
      args.checkboxValues.forEach((value) => {
        // Get the record's datastore and ID
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        // Check that the updated list no longer contains the removed record
        expect(Object.keys(newList[recordDatastore]).includes(recordId), 'the updated list should no longer contain the record that is checked').to.be.false;
      });
    });
  });

  describe('handleRemoveSelectedClick()', function () {
    let deleteSelectedRecordsStub = null;
    let reloadPageSpy = null;
    let setSessionStorageSpy = null;
    let temporaryListBannerSpy = null;
    let toggleSelectedButtonSpy = null;
    let getToggleSelectedTabSpy = null;
    let updateListForTogglingRecordsSpy = null;
    let updateToggleSelectedActionSpy = null;
    let args = null;
    let originalText = null;

    beforeEach(function () {
      deleteSelectedRecordsStub = sinon.stub().returns({});
      reloadPageSpy = sinon.spy();
      setSessionStorageSpy = sinon.spy();
      temporaryListBannerSpy = sinon.spy();
      toggleSelectedButtonSpy = sinon.spy();
      getToggleSelectedTabSpy = sinon.spy();
      updateListForTogglingRecordsSpy = sinon.spy();
      updateToggleSelectedActionSpy = sinon.spy();
      args = {
        deleteRecords: deleteSelectedRecordsStub,
        event: { target: getRemoveSelectedButton() },
        list: global.temporaryList,
        reloadPage: reloadPageSpy,
        setList: setSessionStorageSpy,
        showBanner: temporaryListBannerSpy,
        toggleRemoveButton: toggleSelectedButtonSpy,
        toggleSelectedTab: { click: getToggleSelectedTabSpy },
        updateList: updateListForTogglingRecordsSpy,
        updateToggleSelected: updateToggleSelectedActionSpy
      };

      originalText = args.event.target.textContent;
    });

    afterEach(function () {
      deleteSelectedRecordsStub = null;
      reloadPageSpy = null;
      setSessionStorageSpy = null;
      temporaryListBannerSpy = null;
      toggleSelectedButtonSpy = null;
      getToggleSelectedTabSpy = null;
      updateListForTogglingRecordsSpy = null;
      updateToggleSelectedActionSpy = null;
      args = null;
      originalText = null;
    });

    describe('while viewing My Temporary List', function () {
      beforeEach(function () {
        // Call the function
        handleRemoveSelectedClick({ ...args, viewingList: true });
      });

      it('should call `toggleSelectedButton` with `disabled` set to `true`', function () {
        expect(toggleSelectedButtonSpy.calledWith({ button: args.event.target, disabled: true, originalText, text: 'Removing...' }), '`toggleSelectedButton` should be called with `disabled` set to `true`').to.be.true;
      });

      it('should call `deleteSelectedRecords` with the correct arguments', function () {
        expect(deleteSelectedRecordsStub.calledWith({ list: args.list }), '`deleteSelectedRecords` should be called with the correct arguments').to.be.true;
      });

      it('should call `setSessionStorage` with the correct arguments', function () {
        expect(setSessionStorageSpy.calledWith({ itemName: 'temporaryList', value: deleteSelectedRecordsStub.returnValues[0] }), '`setSessionStorage` should be called with the correct arguments').to.be.true;
      });

      it('should call `reloadPage` to reload the page', function () {
        expect(reloadPageSpy.calledOnce, '`reloadPage` should be called once to reload the page').to.be.true;
      });

      it('should not call `updateListForTogglingRecords` to update the list for adding records', function () {
        expect(updateListForTogglingRecordsSpy.notCalled, '`updateListForTogglingRecords` should not be called to update the list for adding records').to.be.true;
      });

      it('should not call `toggleSelectedButton` with `disabled` set to `false` and the original text', function () {
        expect(toggleSelectedButtonSpy.calledWith({ button: args.event.target, disabled: false, originalText, text: 'Removing...' }), '`toggleSelectedButton` should not be called with `disabled` set to `false` and the original text').to.be.false;
      });

      it('should not call `updateToggleSelectedAction` to update the toggle selected action', function () {
        expect(updateToggleSelectedActionSpy.notCalled, '`updateToggleSelectedAction` should not be called to update the toggle selected action').to.be.true;
      });

      it('should not call `temporaryListBanner` to update the banner with the new list', function () {
        expect(temporaryListBannerSpy.notCalled, '`temporaryListBanner` should not be called to update the banner with the new list').to.be.true;
      });

      it('should not call `getToggleSelectedTab` to get the toggle selected tab', function () {
        expect(getToggleSelectedTabSpy.notCalled, '`getToggleSelectedTab` should not be called to get the toggle selected tab').to.be.true;
      });
    });

    describe('while not viewing My Temporary List', function () {
      beforeEach(function () {
        // Call the function
        handleRemoveSelectedClick({ ...args, viewingList: false });
      });

      it('should call `toggleSelectedButton` with `disabled` set to `true`', function () {
        expect(toggleSelectedButtonSpy.calledWith({ button: args.event.target, disabled: true, originalText, text: 'Removing...' }), '`toggleSelectedButton` should be called with `disabled` set to `true`').to.be.true;
      });

      it('should call `deleteSelectedRecords` with the correct arguments', function () {
        expect(deleteSelectedRecordsStub.calledWith({ list: args.list }), '`deleteSelectedRecords` should be called with the correct arguments').to.be.true;
      });

      it('should call `setSessionStorage` with the correct arguments', function () {
        expect(setSessionStorageSpy.calledWith({ itemName: 'temporaryList', value: deleteSelectedRecordsStub.returnValues[0] }), '`setSessionStorage` should be called with the correct arguments').to.be.true;
      });

      it('should not call `reloadPage` to reload the page', function () {
        expect(reloadPageSpy.notCalled, '`reloadPage` should not be called').to.be.true;
      });

      it('should call `updateListForTogglingRecords` with the correct arguments', function () {
        expect(updateListForTogglingRecordsSpy.calledWith({ list: deleteSelectedRecordsStub.returnValues[0] }), '`updateListForTogglingRecords` should be called with the correct arguments').to.be.true;
      });

      it('should call `toggleSelectedButton` again with `disabled` set to `false` and the original text', function () {
        expect(toggleSelectedButtonSpy.calledWith({ button: args.event.target, disabled: false, originalText, text: 'Removing...' }), '`toggleSelectedButton` should be called with `disabled` set to `false` and the original text').to.be.true;
      });

      it('should call `updateToggleSelectedAction` with the correct arguments', function () {
        expect(updateToggleSelectedActionSpy.calledWith({ list: deleteSelectedRecordsStub.returnValues[0] }), '`updateToggleSelectedAction` should be called with the correct arguments').to.be.true;
      });

      it('should call `temporaryListBanner` to update the banner with the new list', function () {
        expect(temporaryListBannerSpy.calledWith({ list: deleteSelectedRecordsStub.returnValues[0] }), '`temporaryListBanner` should be called to update the banner with the new list').to.be.true;
      });

      it('should call `getToggleSelectedTab` to get the toggle selected tab', function () {
        expect(getToggleSelectedTabSpy.calledOnce, '`getToggleSelectedTab` should be called once to get the toggle selected tab').to.be.true;
      });
    });
  });

  describe('removeSelectedAction()', function () {
    let handleRemoveSelectedClickSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      handleRemoveSelectedClickSpy = sinon.spy();
      args = {
        button: getRemoveSelectedButton(),
        handleRemoveSelected: handleRemoveSelectedClickSpy
      };

      // Call the function
      removeSelectedAction(args);

      // Simulate a click event on the button
      event = new window.Event('click');
      args.button.dispatchEvent(event);
    });

    afterEach(function () {
      handleRemoveSelectedClickSpy = null;
      args = null;
      event = null;
    });

    it('should add a click event listener to the button that calls `handleRemoveSelectedClick` with the correct arguments', function () {
      expect(handleRemoveSelectedClickSpy.calledOnceWithExactly({ event }), '`handleRemoveSelectedClick` should be called with the correct arguments').to.be.true;
    });
  });

  describe('removeSelected()', function () {
    let removeSelectedActionSpy = null;
    let args = null;

    beforeEach(function () {
      removeSelectedActionSpy = sinon.spy();
      args = {
        removeAction: removeSelectedActionSpy
      };

      // Call the function
      removeSelected(args);
    });

    afterEach(function () {
      removeSelectedActionSpy = null;
      args = null;
    });

    it('should call `removeSelectedAction` with the correct arguments', function () {
      expect(removeSelectedActionSpy.calledOnceWithExactly(), '`removeSelectedAction` should be called with the correct arguments').to.be.true;
    });
  });
});
