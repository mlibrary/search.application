import {
  addSelected,
  addSelectedAction,
  fetchAndAddRecords,
  fetchRecordData,
  getAddSelectedButton,
  handleAddSelectedClick,
  styleAddedRecords,
  toggleAddedClass,
  updatedList,
  updateListForAddingRecords
} from '../../../../../../../assets/scripts/datastores/partials/actions/action/toggle-selected/_add.js';
import { defaultTemporaryList, getDatastores, inTemporaryList } from '../../../../../../../assets/scripts/datastores/list/layout.js';
import { filterSelectedRecords, splitCheckboxValue } from '../../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/header/_checkbox.js';
import { expect } from 'chai';
import sinon from 'sinon';

const activeClass = 'record__container--in-temporary-list';
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

describe('add selected', function () {
  let checkboxes = null;
  let checkboxCount = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button id="actions__toggle-selected">Add selected</button>
      <div id="actions__toggle-selected--tabpanel">
        <button class="action__toggle-selected--add">Add to My Temporary List</button>
      </div>
      ${temporaryListHTML}
    `;

    checkboxes = () => {
      return Array.from(document.querySelectorAll('input[type="checkbox"]'));
    };

    checkboxCount = checkboxes().length;
  });

  afterEach(function () {
    checkboxes = null;
    checkboxCount = null;
  });

  describe('updateListForAddingRecords()', function () {
    let args = null;

    beforeEach(function () {
      args = { list: global.temporaryList };

      // Check that `updatedList` is null to begin with
      expect(updatedList, '`updatedList` should be null before calling `updateListForAddingRecords`').to.be.null;

      // Call the function
      updateListForAddingRecords(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the `updatedList` variable with the provided list', function () {
      expect(updatedList, '`updatedList` should be updated with the provided list').to.deep.equal(args.list);
    });
  });

  describe('getAddSelectedButton()', function () {
    it('should return the add selected button element', function () {
      expect(getAddSelectedButton()).to.deep.equal(document.querySelector('button.action__toggle-selected--add'));
    });
  });

  describe('toggleAddedClass()', function () {
    let args = null;
    let getRecord = null;
    let hasActiveClass = null;

    beforeEach(function () {
      getRecord = () => {
        return document.querySelector('.record__container');
      };

      const { recordDatastore, recordId } = getRecord().dataset;

      args = {
        isAdded: true,
        recordDatastore,
        recordId
      };

      hasActiveClass = () => {
        return getRecord().classList.contains(activeClass);
      };

      // Check that the record does not have the class to begin with
      expect(hasActiveClass(), `the record should not have the \`${activeClass}\` class`).to.be.false;

      // Call the function
      toggleAddedClass(args);
    });

    afterEach(function () {
      args = null;
      hasActiveClass = null;
    });

    it(`should toggle the \`${activeClass}\` class`, function () {
      // Check that the class was added
      expect(hasActiveClass(), `the record should have the \`${activeClass}\` class`).to.be.true;

      // Call the function again
      toggleAddedClass({ ...args, isAdded: false });

      // Check that the class was removed
      expect(hasActiveClass(), `the record should not have the \`${activeClass}\` class`).to.be.false;
    });

    it('should return early if the container is not found', function () {
      // Call the function
      expect(() => {
        return toggleAddedClass({ isAdded: true, recordDatastore: 'non-existent-datastore', recordId: 'non-existent-recordId' });
      }, 'calling `toggleAddedClass` with a non-existent container should not throw an error').to.not.throw();
    });
  });

  describe('styleAddedRecords()', function () {
    let inTemporaryListStub = null;
    let splitCheckboxValueStub = null;
    let toggleCheckedStateSpy = null;
    let toggleAddedClassSpy = null;
    let args = null;

    beforeEach(function () {
      inTemporaryListStub = sinon.stub().callsFake(({ list, recordDatastore, recordId }) => {
        return inTemporaryList({ list, recordDatastore, recordId });
      });
      splitCheckboxValueStub = sinon.stub().callsFake(({ value }) => {
        return splitCheckboxValue({ value });
      });
      toggleCheckedStateSpy = sinon.spy();
      toggleAddedClassSpy = sinon.spy();

      args = {
        checkboxes: checkboxes(),
        inList: inTemporaryListStub,
        list: global.temporaryList,
        splitValue: splitCheckboxValueStub,
        toggleChecked: toggleCheckedStateSpy,
        toggleClass: toggleAddedClassSpy
      };

      // Call the function
      styleAddedRecords(args);
    });

    afterEach(function () {
      inTemporaryListStub = null;
      splitCheckboxValueStub = null;
      toggleCheckedStateSpy = null;
      toggleAddedClassSpy = null;
      args = null;
    });

    it('should call `splitCheckboxValue` for each checkbox', function () {
      // Check that `splitCheckboxValue` was called the correct number of times
      expect(splitCheckboxValueStub.callCount, '`splitCheckboxValue` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `splitCheckboxValue` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        expect(splitCheckboxValueStub.calledWithExactly({ value: checkbox.value }), '`splitCheckboxValue` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `inTemporaryList` for each checkbox', function () {
      // Check that `inTemporaryList` was called the correct number of times
      expect(inTemporaryListStub.callCount, '`inTemporaryList` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `inTemporaryList` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value: checkbox.value });
        expect(inTemporaryListStub.calledWithExactly({ list: args.list, recordDatastore, recordId }), '`inTemporaryList` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `toggleAddedClass` with the correct arguments for each checkbox', function () {
      // Check that `toggleAddedClass` was called the correct number of times
      expect(toggleAddedClassSpy.callCount, '`toggleAddedClass` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `toggleAddedClass` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value: checkbox.value });
        const isAdded = inTemporaryList({ list: args.list, recordDatastore, recordId });
        expect(toggleAddedClassSpy.calledWithExactly({ isAdded, recordDatastore, recordId }), '`toggleAddedClass` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `toggleCheckedState` with the correct arguments for each checkbox', function () {
      // Check that `toggleCheckedState` was called the correct number of times
      expect(toggleCheckedStateSpy.callCount, '`toggleCheckedState` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `toggleCheckedState` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value: checkbox.value });
        const isAdded = inTemporaryList({ list: args.list, recordDatastore, recordId });
        expect(toggleCheckedStateSpy.calledWithExactly({ checkbox, isAdded }), '`toggleCheckedState` should be called with the correct arguments').to.be.true;
      });
    });
  });

  describe('fetchRecordData()', function () {
    let fetchStub = null;
    let mockResponse = null;
    let args = null;

    beforeEach(function () {
      fetchStub = sinon.stub(global, 'fetch');
      mockResponse = new Response(
        JSON.stringify({ data: 'record data' }),
        {
          headers: { 'Content-type': 'application/json' },
          status: 200
        }
      );

      args = { recordDatastore: 'catalog', recordId: '1337' };
    });

    afterEach(function () {
      fetchStub.restore();
      mockResponse = null;
      args = null;
    });

    it('should try and fetch the record brief', async function () {
      // Call the function
      await fetchRecordData(args);

      // Check that the fetch URL is correct
      expect(fetchStub.calledOnceWithExactly(`/${args.recordDatastore}/record/${args.recordId}/brief`), 'fetch should be called with the correct URL').to.be.true;
    });

    it('should fetch the record and return the data', async function () {
      // Mock a successful fetch response
      fetchStub.resolves(mockResponse);

      // Call the function
      const recordData = await fetchRecordData(args);

      // Check that the record data is correct
      expect(recordData, 'the record data should be correct').to.deep.equal({ [args.recordId]: { data: 'record data' } });
    });

    it('should return an empty object if the fetch fails', async function () {
      // Mock a failed fetch response
      mockResponse = new Response(null, { status: 404 });
      fetchStub.resolves(mockResponse);

      // Call the function
      const recordData = await fetchRecordData(args);

      // Check that an empty object is returned
      expect(recordData, 'an empty object should be returned').to.deep.equal({});
    });

    it('should return an empty object if an error occurs during fetch', async function () {
      // Mock a fetch error
      fetchStub.rejects(new Error('Network error'));

      // Call the function
      const recordData = await fetchRecordData(args);

      // Check that an empty object is returned
      expect(recordData, 'an empty object should be returned').to.deep.equal({});
    });
  });

  describe('fetchAndAddRecords()', function () {
    let toggleAddedClassSpy = null;
    let fetchRecordDataStub = null;
    let splitCheckboxValueStub = null;
    let args = null;

    beforeEach(async function () {
      toggleAddedClassSpy = sinon.spy();
      fetchRecordDataStub = sinon.stub().callsFake(({ recordDatastore, recordId }) => {
        return global.temporaryList[recordDatastore][recordId];
      });
      splitCheckboxValueStub = sinon.stub().callsFake(({ value }) => {
        return splitCheckboxValue({ value });
      });

      args = {
        addClass: toggleAddedClassSpy,
        checkboxValues: filterSelectedRecords(),
        fetchRecord: fetchRecordDataStub,
        list: defaultTemporaryList,
        splitValue: splitCheckboxValueStub
      };

      // Call the function
      await fetchAndAddRecords(args);
    });

    afterEach(function () {
      toggleAddedClassSpy = null;
      fetchRecordDataStub = null;
      splitCheckboxValueStub = null;
      args = null;
    });

    it('should call `splitCheckboxValue` for each checkbox value', function () {
      // Check that `splitCheckboxValue` was called the correct number of times
      expect(splitCheckboxValueStub.callCount, '`splitCheckboxValue` should be called for each checkbox value').to.equal(args.checkboxValues.length);

      // Check that `splitCheckboxValue` was called with the correct arguments for each checked checkbox value
      args.checkboxValues.forEach((value) => {
        expect(splitCheckboxValueStub.calledWithExactly({ value }), '`splitCheckboxValue` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `fetchRecordData` for each checkbox value', function () {
      // Check that `fetchRecordData` was called the correct number of times
      expect(fetchRecordDataStub.callCount, '`fetchRecordData` should be called for each checkbox value').to.equal(args.checkboxValues.length);

      // Check that `fetchRecordData` was called with the correct arguments for each checked checkbox value
      args.checkboxValues.forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expect(fetchRecordDataStub.calledWithExactly({ recordDatastore, recordId }), '`fetchRecordData` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `toggleAddedClass` with the correct arguments for each checkbox value', function () {
      // Check that `toggleAddedClass` was called the correct number of times
      expect(toggleAddedClassSpy.callCount, '`toggleAddedClass` should be called for each checkbox value').to.equal(args.checkboxValues.length);

      // Check that `toggleAddedClass` was called with the correct arguments for each checked checkbox value
      args.checkboxValues.forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expect(toggleAddedClassSpy.calledWithExactly({ isAdded: true, recordDatastore, recordId }), '`toggleAddedClass` should be called with the correct arguments').to.be.true;
      });
    });

    it('should return the updated list with the added records', async function () {
      // Prepare the expected updated list
      const expectedList = { ...args.list };
      args.checkboxValues.forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expectedList[recordDatastore] = { ...(expectedList[recordDatastore] || {}), ...global.temporaryList[recordDatastore][recordId] };
      });

      // Call the function and get the updated list
      const copiedList = await fetchAndAddRecords(args);

      // Check that the updated list is correct
      expect(copiedList, 'the updated list should contain the added records').to.deep.equal(expectedList);
    });
  });

  describe('handleAddSelectedClick()', function () {
    let fetchAndAddRecordsStub = null;
    let setSessionStorageSpy = null;
    let styleAddedRecordsSpy = null;
    let temporaryListBannerSpy = null;
    let toggleSelectedButtonSpy = null;
    let getToggleSelectedTabSpy = null;
    let updateListForRemovingRecordsSpy = null;
    let updateToggleSelectedActionSpy = null;
    let args = null;
    let originalText = null;
    let actionPromise = null;

    beforeEach(function () {
      fetchAndAddRecordsStub = sinon.stub().resolves(global.temporaryList);
      setSessionStorageSpy = sinon.spy();
      styleAddedRecordsSpy = sinon.spy();
      temporaryListBannerSpy = sinon.spy();
      toggleSelectedButtonSpy = sinon.spy();
      getToggleSelectedTabSpy = sinon.spy();
      updateListForRemovingRecordsSpy = sinon.spy();
      updateToggleSelectedActionSpy = sinon.spy();
      args = {
        addRecords: fetchAndAddRecordsStub,
        event: { target: getAddSelectedButton() },
        list: defaultTemporaryList,
        setList: setSessionStorageSpy,
        showBanner: temporaryListBannerSpy,
        styleRecords: styleAddedRecordsSpy,
        toggleAddButton: toggleSelectedButtonSpy,
        toggleSelectedTab: { click: getToggleSelectedTabSpy },
        updateList: updateListForRemovingRecordsSpy,
        updateToggleSelected: updateToggleSelectedActionSpy
      };

      originalText = args.event.target.textContent;

      // Call the function
      actionPromise = handleAddSelectedClick(args);
    });

    afterEach(function () {
      fetchAndAddRecordsStub = null;
      setSessionStorageSpy = null;
      styleAddedRecordsSpy = null;
      temporaryListBannerSpy = null;
      toggleSelectedButtonSpy = null;
      getToggleSelectedTabSpy = null;
      updateListForRemovingRecordsSpy = null;
      updateToggleSelectedActionSpy = null;
      args = null;
      originalText = null;
      actionPromise = null;
    });

    describe('while processing', function () {
      afterEach(async function () {
        // Wait for the action to complete
        await actionPromise;
      });

      it('should call `toggleSelectedButton` with the correct arguments while processing', function () {
        expect(toggleSelectedButtonSpy.calledWith({ button: args.event.target, disabled: true, originalText, text: 'Adding...' }), '`toggleSelectedButton` should be called once with the correct arguments while processing').to.be.true;
      });

      it('should call `fetchAndAddRecords` with the correct arguments while processing', function () {
        expect(fetchAndAddRecordsStub.calledOnceWithExactly({ list: args.list }), '`fetchAndAddRecords` should be called once with the correct arguments while processing').to.be.true;
      });
    });

    describe('after processing', function () {
      beforeEach(async function () {
        // Wait for the action to complete
        await actionPromise;
      });

      it('should call `setSessionStorage` with the updated list after processing', function () {
        expect(setSessionStorageSpy.calledOnceWithExactly({ itemName: 'temporaryList', value: global.temporaryList }), '`setSessionStorage` should be called once with the updated list after processing').to.be.true;
      });

      it('should call `updateListForRemovingRecords` with the updated list after processing', function () {
        expect(updateListForRemovingRecordsSpy.calledOnceWithExactly({ list: global.temporaryList }), '`updateListForRemovingRecords` should be called once with the updated list after processing').to.be.true;
      });

      it('should call `styleAddedRecords` with the correct arguments after processing', function () {
        expect(styleAddedRecordsSpy.calledOnceWithExactly({ list: global.temporaryList }), '`styleAddedRecords` should be called once with the updated list after processing').to.be.true;
      });

      it('should call `toggleSelectedButton` with the correct arguments after processing', function () {
        expect(toggleSelectedButtonSpy.calledWith({ button: args.event.target, disabled: false, originalText, text: 'Adding...' }), '`toggleSelectedButton` should be called once with the correct arguments after processing').to.be.true;
      });

      it('should call `updateToggleSelectedAction` with the updated list after processing', function () {
        expect(updateToggleSelectedActionSpy.calledOnceWithExactly({ list: global.temporaryList }), '`updateToggleSelectedAction` should be called once with the updated list after processing').to.be.true;
      });

      it('should call `temporaryListBanner` with the correct arguments after processing', function () {
        expect(temporaryListBannerSpy.calledOnceWithExactly({ list: global.temporaryList }), '`temporaryListBanner` should be called once with the correct arguments after processing').to.be.true;
      });

      it('should call `getToggleSelectedTab` to get the toggle selected tab after processing', function () {
        expect(getToggleSelectedTabSpy.calledOnce, '`getToggleSelectedTab` should be called once to get the toggle selected tab after processing').to.be.true;
      });
    });
  });

  describe('addSelectedAction()', function () {
    let handleAddSelectedClickSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      handleAddSelectedClickSpy = sinon.spy();
      args = {
        button: getAddSelectedButton(),
        handleAddSelected: handleAddSelectedClickSpy
      };

      // Call the function
      addSelectedAction(args);

      // Simulate a click event on the button
      event = new window.Event('click');
      args.button.dispatchEvent(event);
    });

    afterEach(function () {
      handleAddSelectedClickSpy = null;
      args = null;
      event = null;
    });

    it('should add a click event listener to the button that calls `handleAddSelectedClick` with the correct arguments', function () {
      expect(handleAddSelectedClickSpy.calledOnceWithExactly({ event }), '`handleAddSelectedClick` should be called with the correct arguments').to.be.true;
    });
  });

  describe('addSelected()', function () {
    let addSelectedActionSpy = null;
    let styleAddedRecordsSpy = null;
    let updateListForAddingRecordsSpy = null;
    let args = null;

    beforeEach(function () {
      addSelectedActionSpy = sinon.spy();
      styleAddedRecordsSpy = sinon.spy();
      updateListForAddingRecordsSpy = sinon.spy();

      args = {
        addAction: addSelectedActionSpy,
        list: global.temporaryList,
        styleRecords: styleAddedRecordsSpy,
        updateList: updateListForAddingRecordsSpy
      };

      // Call the function
      addSelected(args);
    });

    afterEach(function () {
      addSelectedActionSpy = null;
      styleAddedRecordsSpy = null;
      updateListForAddingRecordsSpy = null;
      args = null;
    });

    it('should call `updateListForAddingRecords` with the correct arguments', function () {
      // Check that `updateListForAddingRecords` was called once with the correct arguments
      expect(updateListForAddingRecordsSpy.calledOnceWithExactly({ list: args.list }), '`updateListForAddingRecords` should be called once with the correct arguments').to.be.true;
    });

    it('should call `styleAddedRecords` with the correct arguments', function () {
      // Check that `styleAddedRecords` was called once with the correct arguments
      expect(styleAddedRecordsSpy.calledOnceWithExactly(), '`styleAddedRecords` should be called once with the correct arguments').to.be.true;
    });

    it('should call `addSelectedAction` with the correct arguments', function () {
      // Check that `addSelectedAction` was called once with the correct arguments
      expect(addSelectedActionSpy.calledOnceWithExactly(), '`addSelectedAction` should be called once with the correct arguments').to.be.true;
    });
  });
});
