import {
  fetchAndAddRecord,
  getAddSelectedButton,
  toggleAddedClass
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_add-selected.js';
import { expect } from 'chai';
import { nonEmptyDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const activeClass = 'record__container--in-temporary-list';
let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId) => {
    temporaryListHTML += `
      <div class="record__container" data-record-id="${recordId}" data-record-datastore="${datastore}">
        <input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}">
      </div>
    `;
  });
});

describe('add selected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__add-selected--tabpanel">
        <button class="action__add-selected">Add Selected</button>
      </div>
      ${temporaryListHTML}
    `;
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

  describe('fetchAndAddRecord()', function () {
    let fetchStub = null;
    let mockResponse = null;
    let list = null;
    let recordDatastore = null;
    let recordId = null;
    let toggleClassSpy = null;
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
      list = { datastore: { recordId: {} } };
      [recordDatastore] = Object.keys(list);
      [recordId] = Object.keys(list[recordDatastore]);
      toggleClassSpy = sinon.spy();

      args = {
        list,
        recordDatastore,
        recordId,
        toggleClass: toggleClassSpy
      };
    });

    afterEach(function () {
      fetchStub.restore();
      mockResponse = null;
      list = null;
      recordDatastore = null;
      recordId = null;
      args = null;
      toggleClassSpy = null;
    });

    it('should try and fetch the record brief', async function () {
      // Call the function
      await fetchAndAddRecord(args);

      // Check that the fetch URL is correct
      expect(fetchStub.calledOnceWithExactly(`/${recordDatastore}/record/${recordId}/brief`), 'fetch should be called with the correct URL').to.be.true;
    });

    it('should fetch the record and add it to the list', async function () {
      // Mock a successful fetch response
      fetchStub.resolves(mockResponse);

      // Call the function
      const updatedList = await fetchAndAddRecord(args);

      // Check that the record was added to the list
      expect(updatedList[recordDatastore][recordId], 'the record should have been added to the list').to.deep.equal({ data: 'record data' });
    });

    it('should call the `toggleClass` function with the correct arguments', async function () {
      // Mock a successful fetch response
      fetchStub.resolves(mockResponse);

      // Call the function
      await fetchAndAddRecord(args);

      // Check that the toggleClass function was called with the correct arguments
      expect(toggleClassSpy.calledOnceWithExactly({ isAdded: true, recordDatastore, recordId }), 'toggleClass should be called with the correct arguments').to.be.true;
    });

    it('should return the original list if the fetch fails', async function () {
      // Mock a failed fetch response
      mockResponse = new Response(null, { status: 404 });
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
});
