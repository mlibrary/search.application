import { filterSelectedRecords, getCheckboxes, getCheckedCheckboxes, selectedCitations, someCheckboxesChecked } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';

const nonEmptyDatastores = Object.keys(global.temporaryList).filter((datastore) => {
  return Object.keys(global.temporaryList[datastore]).length > 0;
});
let temporaryListHTML = '';
nonEmptyDatastores.forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
  });
});

describe('checkbox', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ol class="list__items">
        ${temporaryListHTML}
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

  describe('getCheckedCheckboxes', function () {
    it('should return only the checked checkboxes in the temporary list', function () {
      // Check that the correct elements are returned
      expect(getCheckedCheckboxes(), 'only the checked checkboxes should be returned').to.deep.equal(document.querySelectorAll('input[type="checkbox"]:checked'));
    });

    it('should return an empty NodeList if no checkboxes are checked', function () {
      // Remove the checked attribute from all checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Check that an empty NodeList is returned
      expect(getCheckedCheckboxes().length, 'an empty NodeList should be returned if no checkboxes are checked').to.equal(0);
    });
  });

  describe('filterSelectedRecords', function () {
    it('should return an array of the selected record IDs', function () {
      // Check that the correct record IDs are returned
      const selectedRecords = [...getCheckedCheckboxes()].map((checkbox) => {
        return checkbox.value;
      });
      expect(filterSelectedRecords(), 'the correct record IDs should be returned').to.deep.equal(selectedRecords);
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

  describe('selectedCitations', function () {
    beforeEach(function () {
      global.sessionStorage = window.sessionStorage;

      // Set a temporary list in session storage
      global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));
    });

    afterEach(function () {
      // Cleanup
      delete global.sessionStorage;
    });

    it('should return `null` if no type is provided', function () {
      expect(selectedCitations(), 'the return should be `null` if no type is provided').to.be.null;
    });

    it('should return `null` if the incorrect type is provided', function () {
      expect(selectedCitations('wrong type'), 'the return should be `null` if the incorrect type is provided').to.be.null;
    });

    it('should return an array', function () {
      expect(selectedCitations('csl'), '`selectedCitations(type)` should return an array').to.be.an('array');
    });

    it('should return the correct citation type', function () {
      ['csl', 'ris'].forEach((type) => {
        const [datastore, recordId] = getCheckedCheckboxes()[0].value.split(',');
        expect(selectedCitations(type)[0], `\`citation.${type}\` values should be returned for each selected record`).to.deep.equal(global.temporaryList[datastore][recordId].citation[type]);
      });
    });
  });
});
