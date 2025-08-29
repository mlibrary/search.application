import { addToList, getTemporaryList, handleFormSubmit, setTemporaryList, updateResultUI } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import { expect } from 'chai';
import fs from 'fs';
import sinon from 'sinon';

const temporaryList = JSON.parse(fs.readFileSync('./test/fixtures/temporary-list.json', 'utf8'));
const recordIds = Object.keys(temporaryList);
const listItems = (records = recordIds) => {
  let list = `
    <div class="list__go-to list__go-to--empty">
      <div class="list__in-list">
        <span class="strong"></span>
      </div>
    </div>
  `;
  records.forEach((record) => {
    list += `
      <div class="record__container" data-record-id="${record}">
        <form class="list__add-to" action="/catalog/record/${record}/brief" method="post" data-record-id="${record}">
          <button type="submit" title="Add to My Temporary List">
            <span class="icon">add</span>
            <span class="text">Add this record to My Temporary List</span>
          </button>
        </form>
      </div>
    `;
  });
  return list;
};

describe('add to', function () {
  beforeEach(function () {
    global.sessionStorage = window.sessionStorage;
  });

  afterEach(function () {
    delete global.sessionStorage;
  });

  describe('setTemporaryList()', function () {
    beforeEach(function () {
      // Clear session storage before each test
      global.sessionStorage.clear();
    });

    afterEach(function () {
      // Clear session storage after each test
      global.sessionStorage.clear();
    });

    it('should update the temporary list in session storage', function () {
      // Check that the function returns an empty object when no temporary list is set
      expect(getTemporaryList(), '`temporaryList` should return an empty object').to.be.an('object').that.is.empty;

      // Call the function
      setTemporaryList(temporaryList);

      // Check that the temporary list was set correctly
      expect(getTemporaryList(), '`temporaryList` should have been set with the provided object').to.deep.equal(temporaryList);
    });
  });

  describe('getTemporaryList()', function () {
    afterEach(function () {
      // Clear session storage after each test
      global.sessionStorage.clear();
    });

    it('should return an empty object if no temporary list exists', function () {
      // Check that the function returns an empty object when no temporary list is set
      expect(getTemporaryList(), '`temporaryList` should return an empty object').to.be.an('object').that.is.empty;
    });

    it('should return the temporary list from session storage', function () {
      // Set a temporary list in session storage
      setTemporaryList(temporaryList);

      // Check that the function retrieves it correctly
      expect(getTemporaryList(), '`temporaryList` should return a defined object').to.deep.equal(temporaryList);
    });
  });

  describe('updateResultUI()', function () {
    let getContainer = null;
    let getButton = null;
    let callFunction = null;
    const [recordId] = recordIds;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItems([recordId]);

      getContainer = () => {
        return document.querySelector('.record__container');
      };

      getButton = () => {
        return document.querySelector('button');
      };

      callFunction = () => {
        return updateResultUI({ button: getButton(), recordId });
      };

      // Call the function
      callFunction();
    });

    afterEach(function () {
      getContainer = null;
      getButton = null;
      callFunction = null;

      // Clear session storage after each test
      global.sessionStorage.clear();
    });

    it('should toggle the active class on the container', function () {
      // Define the active container class
      const activeContainerClass = 'record__container--active';

      // Check that the container does not have the active class
      expect(getContainer().classList.contains(activeContainerClass), '`.record__container` should not have an active class by default').to.be.false;

      // Set a temporary list in session storage
      setTemporaryList(temporaryList);

      // Call the function again to update the UI
      callFunction();

      // Check that the container now has the active class
      expect(getContainer().classList.contains(activeContainerClass), '`.record__container` should have an active class after adding the record').to.be.true;
    });

    it('should toggle the button attributes', function () {
      // Define the active button class
      const activeButtonClass = 'button__ghost--active';
      // Get the button and its elements
      const button = getButton();
      const [buttonIcon, buttonText] = button.querySelectorAll('span');

      // Check that the container does not have the active class
      expect(button.classList.contains(activeButtonClass), 'the button should not have an active class by default').to.be.false;

      // Check the initial button title and text
      expect(button.getAttribute('title'), 'the button title should be "Add to My Temporary List"').to.equal('Add to My Temporary List');
      expect(buttonIcon.textContent, 'the button icon should be `add`').to.equal('add');
      expect(buttonText.textContent, 'the button text should be "Add this record to My Temporary List"').to.equal('Add this record to My Temporary List');

      // Set a temporary list in session storage
      setTemporaryList(temporaryList);

      // Call the function again to update the UI
      callFunction();

      // Check that the button now has the active class
      expect(button.classList.contains(activeButtonClass), 'the button should have an active class after adding the record').to.be.true;

      // Check the button title and text after updating the UI
      expect(button.getAttribute('title'), 'the button title should be "Remove from My Temporary List"').to.equal('Remove from My Temporary List');
      expect(buttonIcon.textContent, 'the button icon should be `delete`').to.equal('delete');
      expect(buttonText.textContent, 'the button text should be "Remove this record from My Temporary List"').to.equal('Remove this record from My Temporary List');
    });

    it('should call toggleBanner()', function () {
      // Check that the code calls the toggleBanner function
      expect(updateResultUI.toString(), '`updateResultUI` should call `toggleBanner`').to.include('toggleBanner(');
    });
  });

  describe('handleFormSubmit', function () {
    let fetchStub = null;
    let event = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItems();

      // Create a stub for fetch
      fetchStub = sinon.stub(global, 'fetch');

      // Create a fake event
      event = {
        preventDefault: sinon.stub(),
        target: document.querySelector('form.list__add-to')
      };
    });

    afterEach(function () {
      // Clear session storage after each test
      global.sessionStorage.clear();

      fetchStub.restore();
      event = null;
    });

    it('returns early if the event target does not match', async function () {
      // Change the event target to a non-matching element
      event.target = document.createElement('div');

      // Check that the function returns early
      const result = await handleFormSubmit(event);
      expect(result).to.be.undefined;
      expect(event.preventDefault.called).to.be.false;
    });

    it('calls `preventDefault` on the event', async function () {
      // Call the function
      await handleFormSubmit(event);

      // Check if `event.preventDefault` was called
      expect(event.preventDefault.calledOnce).to.be.true;
    });

    it('deletes the record from the temporary list if it is already added', async function () {
      // Set the temporary list in session storage
      setTemporaryList(temporaryList);

      // Check that the temporary list has been set
      expect(getTemporaryList(), '`temporaryList` should be set').to.deep.equal(temporaryList);

      // Define the record ID to remove
      const [recordId] = recordIds;

      // Change the event target to the form for the first record
      event.target = document.querySelector(`form[data-record-id="${recordId}"]`);

      // Call the function
      await handleFormSubmit(event);

      // Check that the temporary list no longer contains the record after submission
      expect(Object.keys(getTemporaryList()), '`temporaryList` should not contain the record after submission').to.not.include(recordId);
    });

    it('returns early if the response is not ok', async function () {
      // Check that the temporary list is empty before submission
      expect(getTemporaryList(), '`temporaryList` should return an empty object before submission').to.be.an('object').that.is.empty;

      // Change the fetch stub to return a non-ok response
      fetchStub.resolves({
        ok: false
      });

      // Call the function
      await handleFormSubmit(event);

      // Check that fetch was called
      expect(fetchStub.calledOnce).to.be.true;

      // Check that the temporary list is still empty
      expect(getTemporaryList(), '`temporaryList` should still be empty').to.be.an('object').that.is.empty;
    });

    it('adds the record to the temporary list if it does not exist', async function () {
      // Check that the temporary list is empty before submission
      expect(getTemporaryList(), '`temporaryList` should return an empty object before submission').to.be.an('object').that.is.empty;

      // Define the record ID to add
      const [recordId] = recordIds;

      // Change the event target to the form for the first record
      event.target = document.querySelector(`form[data-record-id="${recordId}"]`);

      // Call the function
      fetchStub.resolves({
        json: () => {
          return Promise.resolve(temporaryList[recordId]);
        },
        ok: true
      });
      await handleFormSubmit(event);

      // Check that the temporary list has the record after submission
      expect(String(getTemporaryList()), '`temporaryList` should contain the record metadata after submission').to.include(temporaryList[recordId]);
    });

    it('fetches using the action attribute of the form', async function () {
      // Define the fake fetch response
      fetchStub.resolves({
        json: () => {
          return Promise.resolve(temporaryList[recordIds[0]]);
        },
        ok: true
      });

      // Call the function
      await handleFormSubmit(event);

      // Check that fetch was called with the form action URL
      expect(fetchStub.calledOnceWithExactly(`/catalog/record/${recordIds[0]}/brief`)).to.be.true;
    });

    it('should call setTemporaryList()', function () {
      // Check that the code calls the setTemporaryList function
      expect(handleFormSubmit.toString(), '`handleFormSubmit` should call `setTemporaryList`').to.include('setTemporaryList(');
    });

    it('should call updateResultUI()', function () {
      // Check that the code calls the updateResultUI function
      expect(handleFormSubmit.toString(), '`handleFormSubmit` should call `updateResultUI`').to.include('updateResultUI(');
    });
  });

  describe('addToList()', function () {
    let addEventListenerSpy = null;
    let updateResultSpy = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItems();

      // Spy on document.body.addEventListener
      addEventListenerSpy = sinon.spy(document.body, 'addEventListener');
      updateResultSpy = sinon.spy();
    });

    afterEach(function () {
      addEventListenerSpy.restore();
      updateResultSpy = null;
    });

    it('should add a submit event listener to `document.body`, with `handleFormSubmit`', function () {
      // Call the function
      addToList();

      // Check that addEventListener was called with the correct parameters
      expect(addEventListenerSpy.calledWith('submit', handleFormSubmit), '`handleFormSubmit` should be called on `submit`').to.be.true;
    });

    it('calls `updateResult` for each form with correct arguments', function () {
      addToList(updateResultSpy);

      // Should be called for every matching form
      expect(updateResultSpy.callCount).to.equal(recordIds.length);

      // Should be called with correct arguments
      recordIds.forEach((recordId, index) => {
        const form = document.querySelector(`form[data-record-id="${recordId}"]`);
        expect(updateResultSpy.getCall(index).args[0], `${recordId} should call \`updateResult\` with the correct arguments`).to.deep.include({
          button: form.querySelector('button'),
          recordId
        });
      });
    });
  });
});
