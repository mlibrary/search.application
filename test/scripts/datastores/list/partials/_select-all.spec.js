import { getCheckboxes, someCheckboxesChecked } from '../../../../../assets/scripts/datastores/list/layout.js';
import { selectAll, selectAllCheckbox, selectAllState } from '../../../../../assets/scripts/datastores/list/partials/_select-all.js';
import { expect } from 'chai';

describe('select all', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <label class="select-all">
        <input type="checkbox" class="select-all__checkbox">
        <span>Select all</span>
      </label>
      <ol class="list__items">
        <li><input type="checkbox" class="list__item--checkbox" value="Item 1" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="Item 2" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="Item 3" checked></li>
      </ol>
    `;
  });

  describe('selectAllCheckbox()', function () {
    it('should return the `Select all` checkbox element', function () {
      expect(selectAllCheckbox(), 'the `Select all` checkbox should be returned').to.deep.equal(document.querySelector('.select-all > input[type="checkbox"]'));
    });
  });

  describe('selectAllState()', function () {
    beforeEach(function () {
      // Check that the `Select all` checkbox is unchecked before each test
      expect(selectAllCheckbox().checked, 'the `Select all` checkbox should be unchecked before each test').to.be.false;
      expect(selectAllCheckbox().indeterminate, 'the `Select all` checkbox should not be mixed before each test').to.be.false;
    });

    it('should make the `Select all` checkbox checked if all checkboxes are checked', function () {
      // Check that at least one checkbox is unchecked
      const allChecked = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked;
      });
      expect(allChecked, 'all checkboxes should be checked').to.be.true;

      // Call the function
      selectAllState();

      // Check that the button is enabled
      expect(selectAllCheckbox().checked, 'the `Select all` checkbox should be checked when all checkboxes are checked').to.be.true;
    });

    it('should make the `Select all` checkbox mixed if some checkboxes are checked and unchecked', function () {
      // Uncheck one checkbox
      const checkboxes = getCheckboxes();
      checkboxes[0].checked = false;
      // Check that at least one checkbox is unchecked
      expect(someCheckboxesChecked(false), 'at least one checkbox should be unchecked before testing').to.be.true;
      // Check that at least one checkbox is checked
      expect(someCheckboxesChecked(true), 'at least one checkbox should be checked before testing').to.be.true;

      // Call the function
      selectAllState();

      // Check that the button is enabled
      expect(selectAllCheckbox().indeterminate, 'the `Select all` checkbox should be mixed when some checkboxes are checked and unchecked').to.be.true;
    });

    it('should make the `Select all` checkbox unchecked if all checkboxes are unchecked', function () {
      // Uncheck all checkboxes
      [...getCheckboxes()].forEach((checkbox) => {
        return checkbox.removeAttribute('checked');
      });
      const allUnchecked = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked === false;
      });

      expect(allUnchecked, 'all checkboxes should be unchecked').to.be.true;

      // Call the function
      selectAllState();

      // Check that the button is enabled
      expect(selectAllCheckbox().checked, 'the `Select all` checkbox should be unchecked when all checkboxes are unchecked').to.be.false;
    });
  });

  describe('selectAll()', function () {
    it('should check all checkboxes when the `Select all` checkbox is checked', function () {
      // Uncheck one checkbox
      const checkboxes = getCheckboxes();
      checkboxes[0].checked = false;
      // Check that at least one checkbox is unchecked
      expect(someCheckboxesChecked(false), 'at least one checkbox should be unchecked before testing').to.be.true;

      // Call the function
      selectAll();

      // Check the checkbox
      selectAllCheckbox().checked = true;
      selectAllCheckbox().dispatchEvent(new window.Event('change'));

      // Check that all checkboxes are now checked
      const allChecked = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked;
      });
      expect(allChecked, 'all checkboxes should be checked when the `Select all` checkbox is checked').to.be.true;
    });

    it('should uncheck all checkboxes when the `Select all` checkbox is unchecked', function () {
      // Check that all the checkboxes are checked
      const allCheckedStart = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked;
      });
      expect(allCheckedStart, 'all checkboxes should be checked before testing').to.be.true;

      // Call the function
      selectAll();

      // Uncheck the checkbox
      selectAllCheckbox().checked = false;
      selectAllCheckbox().dispatchEvent(new window.Event('change'));

      // Check that all checkboxes are now unchecked
      const allUnchecked = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked === false;
      });
      expect(allUnchecked, 'all checkboxes should be unchecked when the `Select all` checkbox is unchecked').to.be.true;
    });
  });
});
