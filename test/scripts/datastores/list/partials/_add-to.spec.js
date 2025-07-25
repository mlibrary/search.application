import { addToList, getTemporaryList, updateResultUI } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import { expect } from 'chai';

const recordIds = ['12345', '67890'];
const recordMetadata = {};
recordIds.forEach((id) => {
  recordMetadata[id] = { holdings: [], metadata: [] };
});
const listItems = (records) => {
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
        <form class="list__add-to" action="/everything/list/${record}" method="post">
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
  const temporaryList = recordMetadata;

  beforeEach(function () {
    global.sessionStorage = window.sessionStorage;
  });

  afterEach(function () {
    delete global.sessionStorage;
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
      global.sessionStorage.setItem('temporaryList', JSON.stringify(temporaryList));

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
      global.sessionStorage.setItem('temporaryList', JSON.stringify(temporaryList));

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
      global.sessionStorage.setItem('temporaryList', JSON.stringify(temporaryList));

      // Call the function again to update the UI
      callFunction();

      // Check that the button now has the active class
      expect(button.classList.contains(activeButtonClass), 'the button should have an active class after adding the record').to.be.true;

      // Check the button title and text after updating the UI
      expect(button.getAttribute('title'), 'the button title should be "Remove from My Temporary List"').to.equal('Remove from My Temporary List');
      expect(buttonIcon.textContent, 'the button icon should be `delete`').to.equal('delete');
      expect(buttonText.textContent, 'the button text should be "Remove this record from My Temporary List"').to.equal('Remove this record from My Temporary List');
    });
  });

  describe('addToList()', function () {
    let getButton = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItems(recordIds);

      getButton = (recordId) => {
        return document.querySelector(`[data-record-id="${recordId}"] button`);
      };

      // Call the function to add event listeners
      addToList();
    });

    afterEach(function () {
      getButton = null;

      // Clear session storage after each test
      global.sessionStorage.clear();
    });

    it('should add the record metadata to the temporary list on submit', function () {
      // Define the record ID to test
      const [recordId] = recordIds;

      // Check that the temporary list is empty before submission
      expect(getTemporaryList(), '`temporaryList` should return an empty object before submission').to.be.an('object').that.is.empty;

      // Click the button to submit the form
      getButton(recordId).click();

      // Check that the temporary list now contains the record metadata
      expect(getTemporaryList(), '`temporaryList` should contain the record metadata after submission').to.deep.equal({ [recordId]: recordMetadata[recordId] });
    });

    it('should remove the record metadata to the temporary list on submit', function () {
      // Submit all record IDs to the temporary list first
      recordIds.forEach((recordId) => {
        getButton(recordId).click();
      });

      // Check that the temporary list contains all record metadata after submission
      expect(getTemporaryList(), '`temporaryList` should contain all record metadata after submission').to.deep.equal(recordMetadata);

      // Click the button to remove the first record
      getButton(recordIds[0]).click();

      // Check that the temporary list no longer contains the first record
      expect(getTemporaryList(), '`temporaryList` should not contain the first record after removal').to.deep.equal({ [recordIds[1]]: recordMetadata[recordIds[1]] });
    });
  });
});
