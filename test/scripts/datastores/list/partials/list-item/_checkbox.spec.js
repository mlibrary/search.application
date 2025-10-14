import { filterSelectedRecords, getCheckboxes, someCheckboxesChecked } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';

describe('checkbox', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ol class="list__items">
        <li><input type="checkbox" class="list__item--checkbox" value="datastore,recordId1" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="datastore,recordId2"></li>
        <li><input type="checkbox" class="list__item--checkbox" value="datastore,recordId3"></li>
        <li><input type="checkbox" class="list__item--checkbox" value="datastore,recordId4" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="datastore,recordId5"></li>
      </ol>
    `;

    // Check that at least one checkbox is checked
    expect(someCheckboxesChecked(true), 'at least one checkbox should be checked for this test').to.be.true;
  });

  describe('getCheckboxes', function () {
    it('should return all the checkboxes in the temporary list', function () {
      // Check that the correct elements are returned
      expect(getCheckboxes(), 'the correct elements should be returned').to.deep.equal(document.querySelectorAll('input[type="checkbox"]'));
    });
  });

  describe('filterSelectedRecords', function () {
    it('should return an array of the selected record IDs', function () {
      // Check that the correct record IDs are returned
      expect(filterSelectedRecords(), 'the correct record IDs should be returned').to.deep.equal(['datastore,recordId1', 'datastore,recordId4']);
    });

    it('should return an array, even if no records are checked', function () {
      // Remove the checked attribute from all checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Check that the correct record IDs are returned
      expect(filterSelectedRecords(), 'an empty array should return if no checkboxes are checked').to.deep.equal([]);
    });
  });

  describe('someCheckboxesChecked', function () {
    describe('true', function () {
      it('should return `true` if at least one checkbox is checked', function () {
        expect(someCheckboxesChecked(true), 'the function should return `true` if at least one checkbox is checked').to.be.true;
      });

      it('should return `false` if no checkboxes are checked', function () {
        // Uncheck all the checkboxes
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = false;
        });

        // Check that the function returns false
        expect(someCheckboxesChecked(true), 'the function should return `false` if no checkboxes are checked').to.be.false;
      });
    });

    describe('false', function () {
      it('should return `true` if at least one checkbox is unchecked', function () {
        expect(someCheckboxesChecked(false), 'the function should return `true` if at least one checkbox is unchecked').to.be.true;
      });

      it('should return `false` if all checkboxes are checked', function () {
        // Check all the checkboxes
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = true;
        });

        // Check that the function returns false
        expect(someCheckboxesChecked(false), 'the function should return `false` if all checkboxes are checked').to.be.false;
      });
    });
  });
});
