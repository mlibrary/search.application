import { displayCSLData, getCSLTextarea } from '../../../../../../assets/scripts/datastores/partials/actions/action/_citation.js';
import { getCheckboxes, getCheckedCheckboxes, someCheckboxesChecked } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import { nonEmptyDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';

let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
  });
});

describe('citation', function () {
  let getTextareaContent = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl"></textarea>
      </div>
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;

    getTextareaContent = () => {
      return document.querySelector('textarea').value;
    };

    // Check that the textarea is empty
    expect(getTextareaContent(), 'the textarea should be empty before each test').to.be.empty;

    // Check that at least one checkbox is checked
    expect(someCheckboxesChecked(true), 'at least one checkbox should be checked for this test').to.be.true;

    global.sessionStorage = window.sessionStorage;

    // Set a temporary list in session storage
    global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));
  });

  afterEach(function () {
    getTextareaContent = null;
    // Cleanup
    delete global.sessionStorage;
  });

  describe('getCSLTextarea()', function () {
    it('should return the CSL `textarea`', function () {
      expect(getCSLTextarea(), 'the `textarea` that displays the CSL should have been returned').to.equal(document.querySelector('textarea'));
    });
  });

  describe('displayCSLData()', function () {
    beforeEach(function () {
      // Call the function
      displayCSLData();
    });

    it('should include the CSL data of the selected checkboxes in the `textarea`', function () {
      // Check that each checked checkbox has data included
      getCheckedCheckboxes().forEach((checkbox) => {
        const [datastore, recordId] = checkbox.value.split(',');
        expect(getTextareaContent(), 'the checked checkbox should contain the csl data in the `textarea`').to.include(JSON.stringify(global.temporaryList[datastore][recordId].citation.csl));
      });
    });

    it('should not include the CSL data of the unselected checkboxes in the `textarea`', function () {
      // Save all unchecked checkboxes
      const uncheckedCheckboxes = document.querySelectorAll('input[type="checkbox"]:not(:checked)');

      // Make sure at least one checkbox is not checked
      expect(uncheckedCheckboxes.length, 'there should be at least one unchecked checkbox').to.be.greaterThan(0);

      // Make sure that the CSL data length does not equal the number of checkboxes
      expect(JSON.parse(getTextareaContent()).length, 'the CSL data should not contain all data if at least one checkbox is unchecked').to.not.equal(getCheckboxes().length);

      // Loop through all the unchecked checkboxes
      uncheckedCheckboxes.forEach((checkbox) => {
        const [datastore, recordId] = checkbox.value.split(',');
        const data = JSON.stringify(global.temporaryList[datastore][recordId].citation.csl);
        // Check if data exists
        if (getTextareaContent().includes(data)) {
          // Map all checked record IDs
          const checkedValues = [...getCheckedCheckboxes()].map((checkedValue) => {
            const [, checkedRecordId] = checkedValue.value.split(',');
            return checkedRecordId;
          });

          // Check that the unchecked record ID also exists in a checked record
          expect(checkedValues, 'the checkbox record ID should exist in a checked record').to.include(recordId);
        } else {
          // Check if the data is not included
          expect(getTextareaContent(), 'the unchecked checkbox should not contain the csl data in the `textarea`').to.not.include(data);
        }
      });
    });

    it('should not include any CSL data if no checkboxes are checked', function () {
      // Uncheck all the checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Call the function
      displayCSLData();

      // Check that the `textarea` does not contain CSL data
      expect(getTextareaContent(), 'the `textarea` should contain an empty array').to.equal('[]');
    });
  });

  describe('generateFullRecordCitations()', function () {
    // TO DO
  });
});
