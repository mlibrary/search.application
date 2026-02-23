import {
  deleteSelectedRecords,
  displayRemoveSelectedAction,
  getRemoveSelectedButton,
  handleRemoveSelectedClick,
  removeSelected,
  removeSelectedAction,
  toggleRemoveSelectedButton
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_remove-selected.js';
import { filterSelectedRecords, splitCheckboxValue } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import { nonEmptyDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
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
  });

  describe('getRemoveSelectedButton()', function () {
    it('should return the remove selected button element', function () {
      expect(getRemoveSelectedButton(), 'getRemoveSelectedButton() should return the correct button').to.deep.equal(document.querySelector('#actions__remove-selected--tabpanel button.action__remove-selected'));
    });
  });

  describe('toggleRemoveSelectedButton()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getRemoveSelectedButton(),
        disabled: false,
        text: 'Remove from My Temporary List'
      };
    });

    afterEach(function () {
      args = null;
    });

    describe('when `disabled` is `false`', function () {
      beforeEach(function () {
        // Check that `disabled` is `false`
        expect(args.disabled, '`disabled` should be `false`').to.be.false;

        // Call the function
        toggleRemoveSelectedButton(args);
      });

      it('should change the button text to the original text', function () {
        expect(args.button.textContent, 'Button text should be the original text').to.equal(args.text);
      });

      it('should enable the button', function () {
        expect(args.button.hasAttribute('disabled'), 'Button should not have the `disabled` attribute').to.be.false;
      });
    });

    describe('when `disabled` is `true`', function () {
      beforeEach(function () {
        // Check that `disabled` is `true`
        args.disabled = true;
        expect(args.disabled, '`disabled` should be `true`').to.be.true;

        // Call the function
        toggleRemoveSelectedButton(args);
      });

      it('should change the button text to "Removing..."', function () {
        expect(args.button.textContent, 'Button text should be "Removing..."').to.equal('Removing...');
      });

      it('should disable the button', function () {
        expect(args.button.hasAttribute('disabled'), 'Button should have the `disabled` attribute').to.be.true;
      });
    });
  });

  describe('deleteSelectedRecords()', function () {
    let toggleAddedClassSpy = null;
    let splitCheckboxValueStub = null;
    let args = null;
    let updatedList = null;

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
      updatedList = deleteSelectedRecords(args);
    });

    afterEach(function () {
      toggleAddedClassSpy = null;
      splitCheckboxValueStub = null;
      args = null;
      updatedList = null;
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
      expect(updatedList).to.be.an('object');
    });

    it('should return an updated list object with the selected records removed', function () {
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

  describe('handleRemoveSelectedClick()', function () {
    let deleteSelectedRecordsStub = null;
    let displayAddSelectedActionSpy = null;
    let displayRemoveSelectedActionSpy = null;
    let reloadPageSpy = null;
    let setSessionStorageSpy = null;
    let toggleBannerSpy = null;
    let toggleRemoveSelectedButtonSpy = null;
    let args = null;
    let originalText = null;

    beforeEach(function () {
      deleteSelectedRecordsStub = sinon.stub().returns({});
      displayAddSelectedActionSpy = sinon.spy();
      displayRemoveSelectedActionSpy = sinon.spy();
      reloadPageSpy = sinon.spy();
      setSessionStorageSpy = sinon.spy();
      toggleBannerSpy = sinon.spy();
      toggleRemoveSelectedButtonSpy = sinon.spy();
      args = {
        deleteRecords: deleteSelectedRecordsStub,
        displayAddAction: displayAddSelectedActionSpy,
        displayRemoveAction: displayRemoveSelectedActionSpy,
        event: { target: getRemoveSelectedButton() },
        list: global.temporaryList,
        reloadPage: reloadPageSpy,
        removeSelectedButton: getRemoveSelectedButton(),
        setList: setSessionStorageSpy,
        showBanner: toggleBannerSpy,
        toggleRemoveButton: toggleRemoveSelectedButtonSpy,
        viewingList: false
      };

      originalText = args.removeSelectedButton.textContent;

      // Call the function
      handleRemoveSelectedClick(args);

      // Click the button
      args.removeSelectedButton.click();
    });

    afterEach(function () {
      deleteSelectedRecordsStub = null;
      displayAddSelectedActionSpy = null;
      displayRemoveSelectedActionSpy = null;
      reloadPageSpy = null;
      setSessionStorageSpy = null;
      toggleBannerSpy = null;
      toggleRemoveSelectedButtonSpy = null;
      args = null;
      originalText = null;
    });

    it('should call `toggleRemoveSelectedButton` with `disabled` set to `true`', function () {
      expect(toggleRemoveSelectedButtonSpy.calledWith({ button: args.removeSelectedButton, disabled: true }), '`toggleRemoveSelectedButton` should be called with `disabled` set to `true`').to.be.true;
    });

    it('should call `toggleRemoveSelectedButton` with `disabled` set to `false` and the original text', function () {
      expect(toggleRemoveSelectedButtonSpy.calledWith({ button: args.removeSelectedButton, disabled: false, text: originalText }), '`toggleRemoveSelectedButton` should be called with `disabled` set to `false` and the original text').to.be.true;
    });

    it('should call `deleteSelectedRecords` with the correct arguments', function () {
      expect(deleteSelectedRecordsStub.calledWith({ list: args.list }), '`deleteSelectedRecords` should be called with the correct arguments').to.be.true;
    });

    it('should call `setSessionStorage` with the correct arguments', function () {
      expect(setSessionStorageSpy.calledWith({ itemName: 'temporaryList', value: deleteSelectedRecordsStub.returnValues[0] }), '`setSessionStorage` should be called with the correct arguments').to.be.true;
    });

    it('should call `toggleBanner` with the correct arguments', function () {
      expect(toggleBannerSpy.calledWith({ list: deleteSelectedRecordsStub.returnValues[0] }), '`toggleBanner` should be called with the correct arguments').to.be.true;
    });

    it('should call `displayRemoveSelectedAction` with the correct arguments', function () {
      expect(displayRemoveSelectedActionSpy.calledWith({ list: deleteSelectedRecordsStub.returnValues[0] }), '`displayRemoveSelectedAction` should be called with the correct arguments').to.be.true;
    });

    it('should call `displayAddSelectedAction` with the correct arguments', function () {
      expect(displayAddSelectedActionSpy.calledWith({ list: deleteSelectedRecordsStub.returnValues[0] }), '`displayAddSelectedAction` should be called with the correct arguments').to.be.true;
    });

    it('should not call `reloadPage` if `viewingList` is `false`', function () {
      // Check that `viewingList` is `false`
      expect(args.viewingList, '`viewingList` should be `false`').to.be.false;

      // Check that `reloadPage` was not called
      expect(reloadPageSpy.notCalled, '`reloadPage` should not be called').to.be.true;
    });

    it('should call `reloadPage` if `viewingList` is `true`', function () {
      // Check that `viewingList` is `true`
      args.viewingList = true;
      expect(args.viewingList, '`viewingList` should be `true`').to.be.true;

      // Call the function again
      handleRemoveSelectedClick(args);

      // Click the button again
      args.removeSelectedButton.click();

      // Check that `reloadPage` was called
      expect(reloadPageSpy.calledOnce, '`reloadPage` should be called once').to.be.true;
    });
  });

  describe('removeSelectedAction()', function () {
    let handleRemoveSelectedClickSpy = null;
    let args = null;

    beforeEach(function () {
      handleRemoveSelectedClickSpy = sinon.spy();
      args = {
        button: getRemoveSelectedButton(),
        handleRemoveSelected: handleRemoveSelectedClickSpy,
        list: global.temporaryList
      };

      // Call the function
      removeSelectedAction(args);
    });

    afterEach(function () {
      handleRemoveSelectedClickSpy = null;
      args = null;
    });

    it('should add a click event listener to the button that calls `handleRemoveSelectedClick` with the correct arguments', function () {
      // Simulate a click event on the button
      const event = new window.Event('click');
      args.button.dispatchEvent(event);

      // Check that `handleRemoveSelectedClick` was called with the correct arguments
      expect(handleRemoveSelectedClickSpy.calledWith({ event, list: args.list }), '`handleRemoveSelectedClick` should be called with the correct arguments').to.be.true;
    });
  });

  describe('removeSelected()', function () {
    let displayRemoveSelectedActionSpy = null;
    let removeSelectedActionSpy = null;
    let toggleSelectedTabTextSpy = null;
    let args = null;

    beforeEach(function () {
      displayRemoveSelectedActionSpy = sinon.spy();
      removeSelectedActionSpy = sinon.spy();
      toggleSelectedTabTextSpy = sinon.spy();
      args = {
        displayRemoveAction: displayRemoveSelectedActionSpy,
        list: global.temporaryList,
        removeAction: removeSelectedActionSpy,
        selectedTabText: toggleSelectedTabTextSpy
      };

      // Call the function
      removeSelected(args);
    });

    afterEach(function () {
      displayRemoveSelectedActionSpy = null;
      removeSelectedActionSpy = null;
      toggleSelectedTabTextSpy = null;
      args = null;
    });

    it('should call `displayRemoveSelectedAction` with the correct arguments', function () {
      expect(displayRemoveSelectedActionSpy.calledOnceWithExactly({ list: args.list }), '`displayRemoveSelectedAction` should be called with the correct arguments').to.be.true;
    });

    it('should call `toggleSelectedTabText` with the correct arguments', function () {
      expect(toggleSelectedTabTextSpy.calledOnceWithExactly({ tabID: 'actions__remove-selected' }), '`toggleSelectedTabText` should be called with the correct arguments').to.be.true;
    });

    it('should call `removeSelectedAction` with the correct arguments', function () {
      expect(removeSelectedActionSpy.calledOnceWithExactly({ list: args.list }), '`removeSelectedAction` should be called with the correct arguments').to.be.true;
    });
  });
});
