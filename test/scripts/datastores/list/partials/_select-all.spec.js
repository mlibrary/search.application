import { disableSelectAllButton, selectAll, selectAllButton } from '../../../../../assets/scripts/datastores/list/partials/_select-all.js';
import { expect } from 'chai';
import { getCheckboxes } from '../../../../../assets/scripts/datastores/list/layout.js';

describe('select all', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button class="list__button--select-all">Select all</button>
      <button class="list__button--deselect-all">Deselect all</button>
      <button class="list__button--remove-selected">Remove selected</button>
      <ol class="list__items">
        <li><input type="checkbox" class="list__item--checkbox" value="Item 1" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="Item 2"></li>
        <li><input type="checkbox" class="list__item--checkbox" value="Item 3"></li>
      </ol>
    `;
  });

  describe('selectAllButton()', function () {
    it('should return the `Select all` button element', function () {
      expect(selectAllButton(), 'the `Select all` button should be returned').to.deep.equal(document.querySelector('button.list__button--select-all'));
    });
  });

  describe('disableSelectAllButton()', function () {
    it('should enable the `Select all` button if not all checkboxes are checked', function () {
      // Check that at least one checkbox is unchecked
      const someUnchecked = [...getCheckboxes()].some((checkbox) => {
        return checkbox.checked === false;
      });
      expect(someUnchecked, 'at least one checkbox should be unchecked before testing').to.be.true;

      // Call the function
      disableSelectAllButton();

      // Check that the button is enabled
      expect(selectAllButton().hasAttribute('disabled'), 'the `Select all` button should be enabled when not all checkboxes are checked').to.be.false;
    });

    it('should disable the `Select all` button if all checkboxes are checked', function () {
      // Check all the checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = true;
      });

      // Call the function
      disableSelectAllButton();

      // Check that the button is disabled
      expect(selectAllButton().hasAttribute('disabled'), 'the `Select all` button should be disabled when all checkboxes are checked').to.be.true;
    });
  });

  describe('selectAll()', function () {
    it('should select all checkboxes on click', function () {
      // Call the function
      selectAll();

      // Click the button
      selectAllButton().click();

      // Check to make sure all checkboxes are checked
      const allChecked = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked;
      });
      expect(allChecked, 'all checkboxes should be checked after clicking the `Select all` button').to.be.true;
    });

    it('should call `disableDeselectAllButton`', function () {
      // Check that the code calls the disableDeselectAllButton function
      expect(selectAll.toString(), '`selectAll` should call `disableDeselectAllButton`').to.include('disableDeselectAllButton();');
    });

    it('should call `disableRemoveSelectedButton`', function () {
      // Check that the code calls the disableRemoveSelectedButton function
      expect(selectAll.toString(), '`selectAll` should call `disableRemoveSelectedButton`').to.include('disableRemoveSelectedButton();');
    });
  });
});
