import {
  addSelectedAction,
  fetchAndAddRecords,
  fetchRecordData,
  getAddSelectedButton,
  styleAddedRecords,
  toggleAddedClass
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_add-selected.js';
import { defaultTemporaryList, inTemporaryList, nonEmptyDatastores, temporaryListCount } from '../../../../../../assets/scripts/datastores/list/layout.js';
import { filterSelectedRecords, splitCheckboxValue } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import sinon from 'sinon';

const activeClass = 'record__container--in-temporary-list';
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

describe('add selected', function () {
  let checkboxes = null;
  let checkboxCount = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__add-selected--tabpanel">
        <button class="action__add-selected">Add Selected</button>
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

  describe('getAddSelectedButton()', function () {
    it('should return the add selected button element', function () {
      expect(getAddSelectedButton()).to.deep.equal(document.querySelector('button'));
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
      }).to.not.throw();
    });
  });

  describe('styleAddedRecords()', function () {
    let splitCheckboxValueStub = null;
    let inTemporaryListSpy = null;
    let toggleAddedClassSpy = null;
    let args = null;

    beforeEach(function () {
      splitCheckboxValueStub = sinon.stub().returns((checkbox) => {
        return splitCheckboxValue({ value: checkbox.value });
      });
      inTemporaryListSpy = sinon.spy();
      toggleAddedClassSpy = sinon.spy();

      args = {
        checkboxes: checkboxes(),
        list: global.temporaryList
      };
    });

    afterEach(function () {
      splitCheckboxValueStub = null;
      inTemporaryListSpy = null;
      toggleAddedClassSpy = null;
      args = null;
    });

    it('should call `splitCheckboxValue` for each checkbox', function () {
      // Call the function
      styleAddedRecords({ ...args, splitValue: splitCheckboxValueStub });

      // Check that `splitCheckboxValue` was called the correct number of times
      expect(splitCheckboxValueStub.callCount, '`splitCheckboxValue` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `splitCheckboxValue` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        expect(splitCheckboxValueStub.calledWithExactly({ value: checkbox.value }), '`splitCheckboxValue` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `inTemporaryList` for each checkbox', function () {
      // Call the function
      styleAddedRecords({ ...args, inList: inTemporaryListSpy });

      // Check that `inTemporaryList` was called the correct number of times
      expect(inTemporaryListSpy.callCount, '`inTemporaryList` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `inTemporaryList` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value: checkbox.value });
        expect(inTemporaryListSpy.calledWithExactly({
          list: global.temporaryList,
          recordDatastore,
          recordId
        }), '`inTemporaryList` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `toggleAddedClass` for each checkbox', function () {
      // Call the function
      styleAddedRecords({ ...args, toggleClass: toggleAddedClassSpy });

      // Check that `toggleAddedClass` was called the correct number of times
      expect(toggleAddedClassSpy.callCount, '`toggleAddedClass` should be called for each checkbox').to.equal(checkboxCount);

      // Check that `toggleAddedClass` was called with the correct arguments for each checkbox
      checkboxes().forEach((checkbox) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value: checkbox.value });
        const isAdded = inTemporaryList({
          list: global.temporaryList,
          recordDatastore,
          recordId
        });
        expect(toggleAddedClassSpy.calledWithExactly({ isAdded, recordDatastore, recordId }), '`toggleAddedClass` should be called with the correct arguments').to.be.true;
      });
    });

    it('should check the checkbox if the record is in the list', function () {
      // Call the function
      styleAddedRecords({
        checkboxes: checkboxes(),
        list: global.temporaryList
      });

      // Check that the checkboxes are checked/unchecked correctly
      checkboxes().forEach((checkbox) => {
        const inList = inTemporaryList({
          list: global.temporaryList,
          ...splitCheckboxValue({ value: checkbox.value })
        });
        expect(checkbox.checked, `the checkbox for value \`${checkbox.value}\` should be ${inList ? 'checked' : 'unchecked'}`).to.equal(inList);
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
    let args = null;

    beforeEach(function () {
      toggleAddedClassSpy = sinon.spy();
      fetchRecordDataStub = sinon.stub().resolves({});
      args = {
        addClass: toggleAddedClassSpy,
        checkboxValues: filterSelectedRecords(),
        fetchRecord: fetchRecordDataStub,
        list: defaultTemporaryList,
        splitValue: splitCheckboxValue
      };
    });

    afterEach(function () {
      toggleAddedClassSpy = null;
      fetchRecordDataStub = null;
      args = null;
    });

    it('should call `splitCheckboxValue` for each checkbox value', async function () {
      const splitCheckboxValueStub = sinon.stub().returns((checkbox) => {
        return splitCheckboxValue({ value: checkbox.value });
      });

      // Call the function
      await fetchAndAddRecords({ ...args, splitValue: splitCheckboxValueStub });

      // Check that `splitCheckboxValue` was called the correct number of times
      expect(splitCheckboxValueStub.callCount, '`splitCheckboxValue` should be called for each checkbox value').to.equal(args.checkboxValues.length);

      // Check that `splitCheckboxValue` was called with the correct arguments for each checked checkbox value
      filterSelectedRecords().forEach((value) => {
        expect(splitCheckboxValueStub.calledWithExactly({ value }), '`splitCheckboxValue` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `fetchRecord` for each checkbox value', async function () {
      // Call the function
      await fetchAndAddRecords(args);

      // Check that `fetchRecord` was called the correct number of times
      expect(fetchRecordDataStub.callCount, '`fetchRecord` should be called for each checkbox value').to.equal(args.checkboxValues.length);

      // Check that `fetchRecord` was called with the correct arguments for each checked checkbox value
      filterSelectedRecords().forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expect(fetchRecordDataStub.calledWithExactly({ recordDatastore, recordId }), '`fetchRecord` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `addClass` for each checkbox value', async function () {
      // Call the function
      await fetchAndAddRecords(args);

      // Check that `addClass` was called the correct number of times
      expect(toggleAddedClassSpy.callCount, '`addClass` should be called for each checkbox value').to.equal(args.checkboxValues.length);

      // Check that `addClass` was called with the correct arguments for each checked checkbox value
      filterSelectedRecords().forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expect(toggleAddedClassSpy.calledWithExactly({ isAdded: true, recordDatastore, recordId }), '`addClass` should be called with the correct arguments').to.be.true;
      });
    });

    it('should return the updated temporary list', async function () {
      // Prepare a mock record data response
      const mockRecordData = {};
      filterSelectedRecords().forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        mockRecordData[recordId] = { data: `data for ${recordDatastore} record ${recordId}` };
      });

      // Stub `fetchRecord` to return the mock record data
      fetchRecordDataStub.resolves(mockRecordData);

      // Call the function
      const updatedList = await fetchAndAddRecords(args);

      // Check that the updated list contains the new records
      filterSelectedRecords().forEach((value) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expect(updatedList[recordDatastore], `the updated list should contain the datastore \`${recordDatastore}\``).to.exist;
        expect(updatedList[recordDatastore][recordId], `the updated list should contain the record ID \`${recordId}\``).to.exist;
        expect(updatedList[recordDatastore][recordId], `the record data for \`${recordDatastore}\` record ID \`${recordId}\` should be correct`).to.deep.equal(mockRecordData[recordId]);
      });
    });
  });

  describe('addSelectedAction()', function () {
    let fetchAndAddRecordsStub = null;
    let temporaryListCountStub = null;
    let setTemporaryListStub = null;
    let toggleBannerStub = null;
    let styleAddedRecordsStub = null;
    let args = null;

    beforeEach(function () {
      fetchAndAddRecordsStub = sinon.stub().resolves(defaultTemporaryList);
      temporaryListCountStub = sinon.stub().returns(5);
      setTemporaryListStub = sinon.stub();
      toggleBannerStub = sinon.stub();
      styleAddedRecordsStub = sinon.stub();

      args = {
        addRecords: fetchAndAddRecordsStub,
        addSelectedButton: getAddSelectedButton(),
        list: defaultTemporaryList,
        listCount: temporaryListCountStub,
        setList: setTemporaryListStub,
        showBanner: toggleBannerStub,
        styleRecords: styleAddedRecordsStub
      };
    });

    afterEach(function () {
      fetchAndAddRecordsStub = null;
      temporaryListCountStub = null;
      setTemporaryListStub = null;
      toggleBannerStub = null;
      styleAddedRecordsStub = null;
      args = null;
    });

    it('should call `fetchAndAddRecords` with the correct arguments', async function () {
      // Call the function
      await addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Check that `fetchAndAddRecords` was called once with the correct arguments
      expect(fetchAndAddRecordsStub.calledOnceWithExactly({ list: args.list }), '`fetchAndAddRecords` should be called once with the correct arguments').to.be.true;
    });

    it('should disable the `Add selected` button while processing', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Check that the button is disabled
      expect(args.addSelectedButton.disabled, 'the `Add selected` button should be disabled while processing').to.be.true;

      // Wait for the action to complete
      await actionPromise;
    });

    it('should update the `Add selected` button text while processing', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Check that the button text is updated
      expect(args.addSelectedButton.textContent, 'the `Add selected` button text should be updated while processing').to.equal('Adding...');

      // Wait for the action to complete
      await actionPromise;
    });

    it('should re-enable the `Add selected` button after processing', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Wait for the action to complete
      await actionPromise;

      // Check that the button is re-enabled
      expect(args.addSelectedButton.disabled, 'the `Add selected` button should be re-enabled after processing').to.be.false;
    });

    it('should restore the `Add selected` button text after processing', async function () {
      const originalText = args.addSelectedButton.textContent;

      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Wait for the action to complete
      await actionPromise;

      // Check that the button text is restored
      expect(args.addSelectedButton.textContent, 'the `Add selected` button text should be restored after processing').to.equal(originalText);
    });

    it('should call `setTemporaryList` with the updated list', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Wait for the action to complete
      await actionPromise;

      // Check that `setTemporaryList` was called once with the updated list
      expect(setTemporaryListStub.calledOnceWithExactly(args.list), '`setTemporaryList` should be called once with the updated list').to.be.true;
    });

    it('should call `styleAddedRecords` with the correct arguments', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Wait for the action to complete
      await actionPromise;

      // Check that `styleAddedRecords` was called once with the correct arguments
      expect(styleAddedRecordsStub.calledOnceWithExactly({ list: args.list }), '`styleAddedRecords` should be called once with the updated list').to.be.true;
    });

    it('should call `temporaryListCount` and `toggleBanner` with the correct arguments', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Wait for the action to complete
      await actionPromise;

      // Check that `temporaryListCount` was called once with the updated list
      expect(temporaryListCountStub.calledOnceWithExactly(args.list), '`temporaryListCount` should be called once with the updated list').to.be.true;
    });

    it('should call `toggleBanner` with the correct count', async function () {
      // Call the function
      const actionPromise = addSelectedAction(args);

      // Click the button to trigger the action
      args.addSelectedButton.click();

      // Wait for the action to complete
      await actionPromise;

      // Check that `toggleBanner` was called once with the correct count
      expect(toggleBannerStub.calledOnceWithExactly(temporaryListCount(global.temporaryList)), '`toggleBanner` should be called once with the correct count').to.be.true;
    });
  });
});
