import { removeSelected, removeSelectedButton } from '../../../../../assets/scripts/datastores/partials/actions/action/_remove-selected.js';
import { expect } from 'chai';
import { getCheckboxes } from '../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { getTemporaryList } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import sinon from 'sinon';

const nonEmptyDatastores = Object.keys(global.temporaryList).filter((datastore) => {
  return Object.keys(global.temporaryList[datastore]).length > 0;
});
const recordIds = Object.keys(global.temporaryList[nonEmptyDatastores[0]]);
const temporaryListHTML = recordIds.map((recordId, index) => {
  return `<li><input type="checkbox" class="list__item--checkbox" value="${nonEmptyDatastores[0]},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
}).join('');

describe('removeSelected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="actions">
        <button class="action__remove-selected">Remove selected</button>
      </div>
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;
  });

  describe('removeSelectedButton()', function () {
    it('should return the `Remove selected` button element', function () {
      expect(removeSelectedButton(), 'the `Remove selected` button should be returned').to.deep.equal(document.querySelector('button.action__remove-selected'));
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
      global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));

      // Map the currently checked record IDs
      const checkedRecords = [...getCheckboxes()]
        .filter((checkbox) => {
          return checkbox.checked;
        }).map((checkbox) => {
          return checkbox.value;
        });
      checkedRecords.forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(getTemporaryList()[datastore]).includes(recordId), 'the `temporaryList` in session storage should contain the record that is checked').to.be.true;
      });

      // Call the function with a stubbed reload function
      const reloadStub = sinon.stub();
      removeSelected(reloadStub);

      // Click the button
      removeSelectedButton().click();

      // Check that the temporary list no longer contains the removed record(s)
      checkedRecords.forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(getTemporaryList()[datastore]).includes(recordId), 'the `temporaryList` in session storage should no longer contain the record that is checked').to.be.false;
      });

      // Check that the page was reloaded
      expect(reloadStub.calledOnce, '`removeSelected` should call the argument').to.be.true;
    });
  });
});
