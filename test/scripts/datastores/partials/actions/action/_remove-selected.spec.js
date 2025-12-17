import { deleteSelectedRecords, removeSelected } from '../../../../../../assets/scripts/datastores/partials/actions/action/_remove-selected.js';
import { expect } from 'chai';
import { filterSelectedRecords } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { getTemporaryList } from '../../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import sinon from 'sinon';

const nonEmptyDatastores = Object.keys(global.temporaryList).filter((datastore) => {
  return Object.keys(global.temporaryList[datastore]).length > 0;
});
const recordIds = Object.keys(global.temporaryList[nonEmptyDatastores[0]]);
const temporaryListHTML = recordIds.map((recordId, index) => {
  return `<li><input type="checkbox" class="list__item--checkbox" value="${nonEmptyDatastores[0]},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
}).join('');

describe('removeSelected', function () {
  let getButton = null;

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

    // Set a temporary list in session storage
    global.sessionStorage = window.sessionStorage;
    global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));

    getButton = () => {
      return document.querySelector('.actions button.action__remove-selected');
    };
  });

  afterEach(function () {
    // Clean up session storage
    delete global.sessionStorage;

    getButton = null;
  });

  describe('deleteSelectedRecords()', function () {
    let setListSpy = null;
    let args = null;

    beforeEach(function () {
      setListSpy = sinon.spy();
      args = {
        list: getTemporaryList(),
        setList: setListSpy
      };
    });

    afterEach(function () {
      setListSpy = null;
      args = null;
    });

    it('should delete the selected record(s) from session storage', function () {
      // Check that there are selected records to test
      expect(filterSelectedRecords().length, 'there should be selected records to test').to.be.greaterThan(0);

      // Check that the temporary list contains the record(s) that are checked
      filterSelectedRecords().forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should contain the record that is checked').to.be.true;
      });

      // Call the function
      deleteSelectedRecords(args);

      // Check that the temporary list no longer contains the removed record(s)
      filterSelectedRecords().forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should no longer contain the record that is checked').to.be.false;
      });
    });

    it('should not delete unselected record(s) from session storage', function () {
      // Get unselected records
      const unselectedRecords = Array.from(document.querySelectorAll('ol.list__items input[type="checkbox"].list__item--checkbox:not(:checked)')).map((checkbox) => {
        return checkbox.value;
      });

      // Check that there are unselected records to test
      expect(unselectedRecords.length, 'there should be unselected records to test').to.be.greaterThan(0);

      // Check that the temporary list contains the unselected record(s)
      unselectedRecords.forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should contain the unselected record').to.be.true;
      });

      // Call the function
      deleteSelectedRecords(args);

      // Check that the temporary list still contains the unselected record(s)
      unselectedRecords.forEach((record) => {
        const [datastore, recordId] = record.split(',');
        expect(Object.keys(args.list[datastore]).includes(recordId), 'the `temporaryList` in session storage should still contain the unselected record').to.be.true;
      });
    });

    it('should call `setList` function to update session storage', function () {
      // Call the function
      deleteSelectedRecords(args);

      // Check that the spy was called
      expect(setListSpy.calledOnce, '`setList` function should be called once').to.be.true;
    });
  });

  describe('removeSelected()', function () {
    let deleteRecordsSpy = null;
    let reloadPageSpy = null;
    let args = null;

    beforeEach(function () {
      deleteRecordsSpy = sinon.spy();
      reloadPageSpy = sinon.spy();
      args = {
        deleteRecords: deleteRecordsSpy,
        list: getTemporaryList(),
        reloadPage: reloadPageSpy
      };

      // Call the function
      removeSelected(args);

      // Click the button
      getButton().click();
    });

    afterEach(function () {
      deleteRecordsSpy = null;
      reloadPageSpy = null;
      args = null;
    });

    it('should call `deleteRecords` function with the correct arguments when the button is clicked', function () {
      // Check that the spy was called with the correct argument
      expect(deleteRecordsSpy.calledWithExactly({ list: args.list }), '`deleteRecords` function should be called with the correct arguments').to.be.true;
    });

    it('should call `reloadPage` function when the button is clicked', function () {
      // Check that the spy was called
      expect(reloadPageSpy.calledOnce, 'reloadPage function should be called once').to.be.true;
    });
  });
});
