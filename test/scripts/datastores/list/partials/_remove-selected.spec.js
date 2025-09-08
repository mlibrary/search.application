import { disableRemoveSelectedButton, removeSelected, removeSelectedButton } from '../../../../../assets/scripts/datastores/list/partials/_remove-selected.js';
import { getTemporaryList, setTemporaryList } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import { expect } from 'chai';
import { getCheckboxes } from '../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const recordIds = Object.keys(global.temporaryList);
const temporaryListHTML = recordIds.map((recordId, index) => {
  return `<li><input type="checkbox" class="list__item--checkbox" value="${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
}).join('');

describe('removeSelected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button class="list__button--remove-selected">Remove selected</button>
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;
  });

  describe('removeSelectedButton()', function () {
    it('should return the `Remove selected` button element', function () {
      expect(removeSelectedButton(), 'the `Remove selected` button should be returned').to.deep.equal(document.querySelector('button.list__button--remove-selected'));
    });
  });

  describe('disableRemoveSelectedButton()', function () {
    it('should enable the `disableRemoveSelectedButton` button if not all checkboxes are unchecked', function () {
      // Check that at least one checkbox is checked
      const someChecked = [...getCheckboxes()].some((checkbox) => {
        return checkbox.checked;
      });
      expect(someChecked, 'at least one checkbox should be checked before testing').to.be.true;

      // Call the function
      disableRemoveSelectedButton();

      // Check that the button is enabled
      expect(removeSelectedButton().hasAttribute('disabled'), 'the `disableRemoveSelectedButton` button should be enabled when not all checkboxes are unchecked').to.be.false;
    });

    it('should disable the `disableRemoveSelectedButton` button if all checkboxes are unchecked', function () {
      // Uncheck all the checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Call the function
      disableRemoveSelectedButton();

      // Check that the button is disabled
      expect(removeSelectedButton().hasAttribute('disabled'), 'the `disableRemoveSelectedButton` button should be disabled when all checkboxes are checked').to.be.true;
    });
  });

  describe('removeSelected()', function () {
    beforeEach(function () {
      global.sessionStorage = window.sessionStorage;
    });

    afterEach(function () {
      delete global.sessionStorage;
    });

    it('should delete the selected record(s) from session storage and reload the page', function () {
      // Set a temporary list in session storage
      setTemporaryList(global.temporaryList);

      // Map the currently checked record IDs
      const checkedRecordIds = [...getCheckboxes()]
        .filter((checkbox) => {
          return checkbox.checked;
        }).map((checkbox) => {
          return checkbox.value;
        });
      expect(Object.keys(getTemporaryList()).includes(checkedRecordIds[0]), 'the `temporaryList` in session storage should contain the record IDs that are checked').to.be.true;

      // Call the function with a stubbed reload function
      const reloadStub = sinon.stub();
      removeSelected(reloadStub);

      // Click the button
      removeSelectedButton().click();

      // Check that the temporary list no longer contains the removed record(s)
      expect(Object.keys(getTemporaryList()).includes(checkedRecordIds[0]), 'the `temporaryList` in session storage should no longer contain the record IDs that are checked').to.be.false;

      // Check that the page was reloaded
      expect(reloadStub.calledOnce, '`removeSelected` should call the argument').to.be.true;
    });
  });
});
