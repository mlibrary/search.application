import { expect } from 'chai';
import { fetchAndAddRecord } from '../../../../../../assets/scripts/datastores/partials/actions/action/_add-selected.js';
import sinon from 'sinon';

describe('add selected', function () {
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

      args = { list, recordDatastore, recordId };
    });

    afterEach(function () {
      fetchStub.restore();
      list = null;
      recordDatastore = null;
      recordId = null;
      args = null;
    });

    it('should try and fetch the record brief', async function () {
      // Call the function
      await fetchAndAddRecord(args);

      // Check that the fetch URL is correct
      expect(fetchStub.calledOnceWithExactly(`/${recordDatastore}/record/${recordId}/brief`), 'fetch should be called with the correct URL').to.be.true;
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
