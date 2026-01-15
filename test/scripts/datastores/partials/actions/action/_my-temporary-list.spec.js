import {
  defaultTemporaryList,
  fetchAndAddRecord,
  getTemporaryList,
  inTemporaryList,
  removeRecordFromList,
  setTemporaryList,
  toggleTabpanelButtonUI,
  toggleTabUI
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_my-temporary-list.js';
import { expect } from 'chai';
import sinon from 'sinon';

const listName = 'temporaryList';
const addToClass = 'list__add-to';
let formsHTML = '';
Object.keys(global.temporaryList).forEach((datastore) => {
  Object.keys(global.temporaryList[datastore]).forEach((recordId) => {
    formsHTML += `<form action="/${datastore}/record/${recordId}/brief" method="post" class="${addToClass}" data-record-id="${recordId}" data-record-datastore="${datastore}"></form>`;
  });
});

describe('my temporary list', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="fake-form" method="post"></form>
      ${formsHTML}
    `;
  });

  describe('getTemporaryList()', function () {
    let getTemporaryListStub = null;

    beforeEach(function () {
      global.sessionStorage = { getItem: sinon.stub() };
      getTemporaryListStub = global.sessionStorage.getItem;

      // Reset the stub before each test
      getTemporaryListStub.reset();
    });

    it(`should call \`sessionStorage.getItem\` with \`${listName}\``, function () {
      // Make sure `sessionStorage` is defined
      getTemporaryListStub.returns('');

      // Call the function
      getTemporaryList();

      // Check that `temporaryList` was called
      expect(getTemporaryListStub.calledOnceWithExactly(listName), `\`${listName}\` should have been called`).to.be.true;
    });

    describe('returning valid data', function () {
      it('should parse and return a string value from `sessionStorage.getItem`', function () {
        // Create and assign a string value
        const string = 'example';
        getTemporaryListStub.withArgs(listName).returns(`"${string}"`);

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns the string value
        expect(result, `the result should have returned ${string}`).to.equal(string);
      });

      it('should parse and return an object from `sessionStorage.getItem`', function () {
        // Create and assign an object value
        const obj = { abc: 1, def: 'c' };
        getTemporaryListStub.withArgs(listName).returns(JSON.stringify(obj));

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns the object value
        expect(result, 'the result should have returned the object value').to.deep.equal(obj);
      });
    });

    describe('returning `defaultTemporaryList`', function () {
      it('should return `defaultTemporaryList` if `sessionStorage.getItem` returns `null`', function () {
        // Assign `null`
        getTemporaryListStub.withArgs(listName).returns(null);

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns `defaultTemporaryList`
        expect(result, 'the result should have returned `defaultTemporaryList`').to.deep.equal(defaultTemporaryList);
      });

      it('should return `defaultTemporaryList` if `sessionStorage.getItem` returns "undefined"', function () {
        // Assign "undefined"
        getTemporaryListStub.withArgs(listName).returns('undefined');

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns `defaultTemporaryList`
        expect(result, 'the result should have returned `defaultTemporaryList`').to.deep.equal(defaultTemporaryList);
      });

      it('should return `defaultTemporaryList` if `sessionStorage.getItem` returns "null"', function () {
        // Assign "null"
        getTemporaryListStub.withArgs(listName).returns('null');

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns `defaultTemporaryList`
        expect(result, 'the result should have returned `defaultTemporaryList`').to.deep.equal(defaultTemporaryList);
      });

      it('should return `defaultTemporaryList` if `sessionStorage.getItem` returns an empty string', function () {
        // Assign an empty string
        getTemporaryListStub.withArgs(listName).returns('');

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns `defaultTemporaryList`
        expect(result, 'the result should have returned `defaultTemporaryList`').to.deep.equal(defaultTemporaryList);
      });

      it('should return `defaultTemporaryList` if `sessionStorage.getItem` returns invalid JSON', function () {
        // Assign invalid JSON
        getTemporaryListStub.withArgs(listName).returns('not valid json');

        // Assign the result
        const result = getTemporaryList();

        // Check that the result returns `defaultTemporaryList`
        expect(result, 'the result should have returned `defaultTemporaryList`').to.deep.equal(defaultTemporaryList);
      });
    });
  });

  describe('setTemporaryList()', function () {
    let setTemporaryListStub = null;

    beforeEach(function () {
      global.sessionStorage = { setItem: sinon.stub() };
      setTemporaryListStub = global.sessionStorage.setItem;

      // Reset the stub before each test
      setTemporaryListStub.reset();
    });

    it(`should stringify and set the value in \`sessionStorage\` under \`${listName}\``, function () {
      // Call the function
      setTemporaryList(global.temporaryList);

      // Check that a stringified value was set under `temporaryList`
      expect(setTemporaryListStub.calledOnceWithExactly(listName, JSON.stringify(global.temporaryList)), `the value should have been stringified under \`${listName}\``).to.be.true;
    });

    it('should handle string values too', function () {
      // Create a string value
      const string = 'example';
      expect(string, 'the example should be a string').to.be.a('string');

      // Call the function
      setTemporaryList(string);

      // Check that a stringified value was set under `temporaryList`
      expect(setTemporaryListStub.calledOnceWithExactly(listName, JSON.stringify(string)), `the string value should have returned under \`${listName}\``).to.be.true;
    });
  });

  describe('inTemporaryList()', function () {
    let list = null;
    let recordDatastore = null;
    let recordId = null;

    beforeEach(function () {
      list = { ...global.temporaryList };
      // Grab the first datastore
      [recordDatastore] = Object.keys(global.temporaryList);
      // Grab the first record ID of the first datastore
      [recordId] = Object.keys(global.temporaryList[recordDatastore]);
    });

    afterEach(function () {
      list = null;
      recordDatastore = null;
      recordId = null;
    });

    it('should return true if both recordDatastore and recordId exist', function () {
      // Assign the result
      const result = inTemporaryList({ list, recordDatastore, recordId });

      // Check that the result returns true
      expect(result, '`inTemporaryList` should have returned `true`').to.be.true;
    });

    it('should return false if recordDatastore exists but recordId does not', function () {
      // Assign the result with a non-existent record ID
      const result = inTemporaryList({ list, recordDatastore, recordId: 'non-existent' });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` for a non-existent record ID').to.be.false;
    });

    it('should return false if recordDatastore does not exist', function () {
      // Assign the result with a non-existent datastore
      const result = inTemporaryList({ list, recordDatastore: 'non-existent', recordId });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` for a non-existent datastore').to.be.false;
    });

    it('should return false if list is empty', function () {
      // Assign the result with an empty list
      const result = inTemporaryList({ list: {}, recordDatastore, recordId });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` for an empty list').to.be.false;
    });

    it('should handle recordDatastore that exists but is not an object gracefully', function () {
      // Make the datastore return `null`
      list[recordDatastore] = null;

      // Assign the result
      const result = inTemporaryList({ list, recordDatastore, recordId });

      // Check that the result returns false
      expect(result, '`inTemporaryList` should have returned `false` if a datastore returns null').to.be.false;
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

  describe('toggleTabUI()', function () {
    let getButton = null;
    let args = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `<button></button>`;

      getButton = () => {
        return document.querySelector('button');
      };

      args = {
        button: getButton(),
        isAdded: true,
        isFullRecordView: true
      };
    });

    describe('class', function () {
      beforeEach(function () {
        // Check that the button does not have a class
        expect(getButton().className, 'the button should not have a class').to.equal('');
      });

      it('should add a class if `isAdded` is `true`', function () {
        // Check that `isAdded` is `true`
        expect(args.isAdded, 'the `isAdded` flag should be true').to.be.true;

        // Call the function
        toggleTabUI(args);

        // Check that the class has been added
        expect(getButton().className, 'the button should have a class').to.equal('actions__my-temporary-list--remove');
      });

      it('should remove the class if `isAdded` is `false`', function () {
        // Check that `isAdded` is `false`
        args.isAdded = false;
        expect(args.isAdded, 'the `isAdded` flag should be false').to.be.false;

        // Call the function
        toggleTabUI(args);

        // Check that the class has been removed
        expect(getButton().className, 'the button should not have a class').to.equal('');
      });
    });

    describe('text', function () {
      beforeEach(function () {
        // Check that the button does not have text
        expect(getButton().textContent, 'the button should not have text').to.equal('');
      });

      describe('full record view', function () {
        beforeEach(function () {
          // Check that full record is being viewed
          expect(args.isFullRecordView, 'the `isFullRecordView` flag should be true').to.be.true;

          // Call the function
          toggleTabUI(args);
        });

        it('should update the text to remove the item', function () {
          expect(getButton().textContent, 'the button should have the correct text').to.equal('Remove item from list');
        });

        it('should update the text to add the item', function () {
          // Check that `isAdded` is set to `false`
          args.isAdded = false;
          expect(args.isAdded, 'the `isAdded` flag should be false').to.be.false;

          // Call the function again
          toggleTabUI(args);

          // Check that the button text has been updated
          expect(getButton().textContent, 'the button should have the correct text').to.equal('Add item to list');
        });
      });

      describe('not full record view', function () {
        beforeEach(function () {
          // Check that full record is not being viewed
          args.isFullRecordView = false;
          expect(args.isFullRecordView, 'the `isFullRecordView` flag should be false').to.be.false;

          // Call the function
          toggleTabUI(args);
        });

        it('should update the text to remove the selected items', function () {
          expect(getButton().textContent, 'the button should have the correct text').to.equal('Remove selected from list');
        });

        it('should update the text to add the selected items', function () {
          // Check that `isAdded` is set to `false`
          args.isAdded = false;
          expect(args.isAdded, 'the `isAdded` flag should be false').to.be.false;

          // Call the function again
          toggleTabUI(args);

          // Check that the button text has been updated
          expect(getButton().textContent, 'the button should have the correct text').to.equal('Add selected to list');
        });
      });
    });
  });

  describe('toggleTabpanelButtonUI()', function () {
    let getButton = null;
    let args = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `<button></button>`;

      getButton = () => {
        return document.querySelector('button');
      };

      args = {
        button: getButton(),
        isAdded: true
      };

      // Check that the button does not have text
      expect(getButton().textContent, 'the button should not have text').to.equal('');

      // Call the function
      toggleTabpanelButtonUI(args);
    });

    it('should update the text to remove the item', function () {
      expect(getButton().textContent, 'the button should have the correct text').to.equal('Remove from My Temporary List');
    });

    it('should update the text to add the item', function () {
      // Check that `isAdded` is set to `false`
      args.isAdded = false;
      expect(args.isAdded, 'the `isAdded` flag should be false').to.be.false;

      // Call the function again
      toggleTabpanelButtonUI(args);

      // Check that the button text has been updated
      expect(getButton().textContent, 'the button should have the correct text').to.equal('Add to My Temporary List');
    });
  });
});
