import {
  fetchAndAddRecord,
  removeRecordFromList,
  toggleButtonText
} from '../../../../../../../assets/scripts/datastores/partials/actions/action/my-temporary-list/_button.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('button', function () {
  let getButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `<button></button>`;

    getButton = () => {
      return document.createElement('button');
    };
  });

  describe('toggleButtonText()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        isAdded: false
      };

      // Check that the button text is initially empty
      expect(args.button.textContent).to.equal('');

      // Call the function
      toggleButtonText(args);
    });

    it('should update the button text to "Add to My Temporary List" when `isAdded` is `false`', function () {
      // Check `isAdded` is set to `false`
      expect(args.isAdded, '`isAdded` should be `false`').to.equal(false);

      // Check the button text has been updated
      expect(args.button.textContent, 'Button text should be "Add to My Temporary List"').to.equal('Add to My Temporary List');
    });

    it('should update the button text to "Remove from My Temporary List" when `isAdded` is `true`', function () {
      // Check `isAdded` is set to `true`
      args.isAdded = true;
      expect(args.isAdded, '`isAdded` should be `true`').to.equal(true);

      // Call the function again
      toggleButtonText(args);

      // Check the button text has been updated
      expect(args.button.textContent, 'Button text should be "Remove from My Temporary List"').to.equal('Remove from My Temporary List');
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
});
