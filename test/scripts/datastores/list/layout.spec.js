import { getCheckboxes, someCheckboxesChecked } from '../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';

const checkboxHTML = `
  <ol class="list__items">
    <li><input type="checkbox" class="list__item--checkbox" value="rec1" checked></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec2"></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec3"></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec4"></li>
    <li><input type="checkbox" class="list__item--checkbox" value="rec5"></li>
  </ol>
`;

describe('layout', function () {
  describe('getCheckboxes()', function () {
    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = checkboxHTML;
    });

    it('should return all the checkboxes in the temporary list', function () {
      // Check that the correct elements are returned
      expect(getCheckboxes(), 'the correct elements should be returned').to.deep.equal(document.querySelectorAll('ol.list__items input[type="checkbox"].list__item--checkbox'));
    });
  });

  describe('someCheckboxesChecked()', function () {
    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = checkboxHTML;
    });

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
