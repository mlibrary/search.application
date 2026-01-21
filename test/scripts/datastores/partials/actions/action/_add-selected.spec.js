import {
  addSelected,
  fetchAndAddRecord,
  toggleAddSelected
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_add-selected.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('add selected', function () {
  let getTab = null;
  let getTabPanel = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__add-selected" aria-selected="true"></div>
      <div id="actions__add-selected--tabpanel" style="display: block;"></div>
    `;

    getTab = () => {
      return document.querySelector('#actions__add-selected');
    };

    getTabPanel = () => {
      return document.querySelector('#actions__add-selected--tabpanel');
    };
  });

  afterEach(function () {
    getTab = null;
    getTabPanel = null;
  });

  describe('toggleAddSelected()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        isAdded: false,
        isTemporaryList: false
      };

      // Check that the tab has `aria-selected` set
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('true');

      // Check that the tab does not have `style` set
      expect(getTab().getAttribute('style'), '`style` should not be set on the tab').to.equal(null);

      // Check that the tabpanel has `display` set
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('block');
    });

    it('should show the action when not viewing the temporary list and not already added', function () {
      // Check that `isAdded` is false
      expect(args.isAdded).to.be.false;

      // Check that `isTemporaryList` is false
      expect(args.isTemporaryList).to.be.false;

      // Call the function
      toggleAddSelected(args);

      // Check that the tab has `aria-selected` set to true
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('true');

      // Check that the tab does not have `style` set
      expect(getTab().getAttribute('style'), '`style` should not be set on the tab').to.equal(null);

      // Check that the tabpanel is displaying
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('block');
    });

    it('should not show the action when not viewing the temporary list and is already added', function () {
      // Check that `isAdded` is true
      args.isAdded = true;
      expect(args.isAdded).to.be.true;

      // Check that `isTemporaryList` is false
      expect(args.isTemporaryList).to.be.false;

      // Call the function
      toggleAddSelected(args);

      // Check that the tab has `aria-selected` set to false
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('false');

      // Check that the tab is not displaying
      expect(getTab().style.display, '`display` should be set on the tab').to.equal('none');

      // Check that the tabpanel is not displaying
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('none');
    });

    it('should not show the action when viewing the temporary list and is already added', function () {
      // Check that `isAdded` is true
      args.isAdded = true;
      expect(args.isAdded).to.be.true;

      // Check that `isTemporaryList` is true
      args.isTemporaryList = true;
      expect(args.isTemporaryList).to.be.true;

      // Call the function
      toggleAddSelected(args);

      // Check that the tab has `aria-selected` set to false
      expect(getTab().getAttribute('aria-selected'), '`aria-selected` should be set').to.equal('false');

      // Check that the tab is not displaying
      expect(getTab().style.display, '`display` should be set on the tab').to.equal('none');

      // Check that the tabpanel is not displaying
      expect(getTabPanel().style.display, '`display` should be set on the tabpanel').to.equal('none');
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

  describe('addSelected()', function () {
    it('should call toggleAddSelected()', function () {
      // Create spy for the toggleAction function
      const toggleSpy = sinon.spy();

      // Call the function
      addSelected({ toggleAction: toggleSpy });

      // Check that the toggleAction function was called once with the correct arguments
      expect(toggleSpy.calledOnceWithExactly({ isAdded: false }), '`toggleAction` should be called once with the correct arguments').to.be.true;
    });
  });
});
