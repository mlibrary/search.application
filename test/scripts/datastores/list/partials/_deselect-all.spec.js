import { deselectAll, deselectAllButton, disableDeselectAllButton } from '../../../../../assets/scripts/datastores/list/partials/_deselect-all.js';
import { expect } from 'chai';

describe('deselect all', function () {
  let getCheckboxes = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button class="list__button--select-all">Select all</button>
      <button class="list__button--deselect-all">Deselect all</button>
      <ol class="list__items">
        <li><input type="checkbox" class="list__item--checkbox" value="Item 1" checked></li>
        <li><input type="checkbox" class="list__item--checkbox" value="Item 2"></li>
        <li><input type="checkbox" class="list__item--checkbox" value="Item 3"></li>
      </ol>
    `;

    getCheckboxes = () => {
      return document.querySelectorAll('input[type="checkbox"]');
    };
  });

  afterEach(function () {
    getCheckboxes = null;
  });

  describe('deselectAllButton()', function () {
    it('should return the `Deselect all` button element', function () {
      expect(deselectAllButton(), 'the `Deselect all` button should be returned').to.deep.equal(document.querySelector('button.list__button--deselect-all'));
    });
  });

  describe('disableDeselectAllButton()', function () {
    it('should enable the `Deselect all` button if not all checkboxes are unchecked', function () {
      // Check that at least one checkbox is checked
      const someChecked = [...getCheckboxes()].some((checkbox) => {
        return checkbox.checked;
      });
      expect(someChecked, 'at least one checkbox should be checked before testing').to.be.true;

      // Call the function
      disableDeselectAllButton();

      // Check that the button is enabled
      expect(deselectAllButton().hasAttribute('disabled'), 'the `Deselect all` button should be enabled when not all checkboxes are unchecked').to.be.false;
    });

    it('should disable the `Deselect all` button if all checkboxes are unchecked', function () {
      // Uncheck all the checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Call the function
      disableDeselectAllButton();

      // Check that the button is disabled
      expect(deselectAllButton().hasAttribute('disabled'), 'the `Deselect all` button should be disabled when all checkboxes are checked').to.be.true;
    });
  });

  describe('deselectAll()', function () {
    it('should deselect all checkboxes on click', function () {
      // Call the function
      deselectAll();

      // Click the button
      deselectAllButton().click();

      // Check to make sure all checkboxes are unchecked
      const allUnchecked = [...getCheckboxes()].every((checkbox) => {
        return checkbox.checked === false;
      });
      expect(allUnchecked, 'all checkboxes should be unchecked after clicking the `Deselect all` button').to.be.true;
    });

    it('should call `disableSelectAllButton`', function () {
      // Check that the code calls the disableSelectAllButton function
      expect(deselectAll.toString(), '`deselectAll` should call `disableSelectAllButton`').to.include('disableSelectAllButton();');
    });
  });
});
