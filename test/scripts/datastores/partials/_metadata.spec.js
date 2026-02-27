import {
  cloneMetadataRow,
  getListItemMetadataTable,
  prepareMetadataElement,
  updateMetadata,
  updateMetadataRow,
  updateMetadataRowField,
  updateMetadataRowList,
  updateMetadataTable
} from '../../../../assets/scripts/datastores/partials/_metadata.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

// Create a shallow copy of the temporary list
const list = { ...global.temporaryList };
// Grab the first non-empty datastore
const [datastore] = getDatastores({ list });
// Grab the first record from the non-empty datastore
const [record] = Object.values(list[datastore]);
// Grab the metadata from that record
const { metadata } = record;

describe('metadata', function () {
  let getListItem = null;
  let getTable = null;
  let getTableRow = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <li class="results__list-item">
        <table class="metadata">
          <tbody>
            <tr>
              <th>Field</th>
              <td>
                <ul class="metadata__list" id="metadata__toggle--field">
                  <li>
                    <ul class="metadata__list--parallel">
                      <li>Original Data</li>
                      <li>Transliterated Data</li>
                    </ul>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </li>
    `;

    getListItem = () => {
      return document.querySelector('.results__list-item');
    };

    getTable = () => {
      return document.querySelector('table');
    };

    getTableRow = () => {
      return document.querySelector('table > tbody > tr');
    };
  });

  afterEach(function () {
    getListItem = null;
    getTable = null;
    getTableRow = null;
  });

  describe('getListItemMetadataTable()', function () {
    it('should return the correct metadata table', function () {
      expect(getListItemMetadataTable({ listItem: getListItem() }), '`getListItemMetadataTable` should return the correct metadata table').to.deep.equal(getTable());
    });
  });

  describe('prepareMetadataElement()', function () {
    let removeToggleButtonSpy = null;
    let args = null;

    beforeEach(function () {
      removeToggleButtonSpy = sinon.spy();
      args = {
        listItem: getListItem(),
        removeToggle: removeToggleButtonSpy,
        table: getTable()
      };

      // Call the function
      prepareMetadataElement(args);
    });

    afterEach(function () {
      removeToggleButtonSpy = null;
      args = null;
    });

    it('should call `removeToggleButton` with the correct arguments', function () {
      expect(removeToggleButtonSpy.calledOnceWithExactly({ listItem: args.listItem }), '`removeToggleButton` should have been called with the correct arguments').to.be.true;
    });

    it('should remove the `id` attribute from the metadata list', function () {
      expect(args.listItem.querySelector('ul.metadata__list').id, '`prepareMetadataElement` should remove the `id` attribute from the metadata list').to.equal('');
    });
  });

  describe('cloneMetadataRow()', function () {
    let args = null;
    let clonedRow = null;

    beforeEach(function () {
      args = {
        row: getTableRow()
      };

      // Call the function
      clonedRow = cloneMetadataRow(args);
    });

    afterEach(function () {
      args = null;
      clonedRow = null;
    });

    it('should clone the metadata row', function () {
      expect(clonedRow.isEqualNode(args.row), '`cloneMetadataRow` should clone the metadata row').to.be.true;
    });
  });

  describe('updateMetadataRowField()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        field: 'New Field',
        row: getTableRow()
      };

      // Call the function
      updateMetadataRowField(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the metadata row field', function () {
      expect(args.row.querySelector('th').textContent, '`updateMetadataRowField` should update the metadata row field').to.equal(args.field);
    });
  });

  describe('updateMetadataRowList()', function () {
    let args = null;
    let getDefinedValues = null;
    let getListItems = null;

    beforeEach(function () {
      args = {
        original: 'Original Metadata',
        row: getTableRow(),
        transliterated: null
      };

      getDefinedValues = [args.original, args.transliterated].filter(Boolean);

      getListItems = () => {
        return args.row.querySelectorAll('ul.metadata__list--parallel > li');
      };

      // Check that there are two list items before testing
      expect(getListItems().length, '`updateMetadataRowList` should have two list items before testing').to.equal(2);

      // Call the function
      updateMetadataRowList(args);
    });

    afterEach(function () {
      args = null;
      getDefinedValues = null;
      getListItems = null;
    });

    it('should update the metadata row list', function () {
      getDefinedValues.forEach((value, index) => {
        expect(getListItems()[index].textContent, '`updateMetadataRowList` should update the metadata row list').to.equal(value);
      });
    });

    it('should remove the list item if the data does not exist', function () {
      expect(getListItems().length, '`updateMetadataRowList` should remove the list item if the data does not exist').to.equal(getDefinedValues.length);
    });
  });

  describe('updateMetadataRow()', function () {
    let updateMetadataRowListSpy = null;
    let updateMetadataRowFieldSpy = null;
    let args = null;

    beforeEach(function () {
      updateMetadataRowListSpy = sinon.spy();
      updateMetadataRowFieldSpy = sinon.spy();
      args = {
        data: {
          field: 'New Field',
          original: 'Original Metadata',
          transliterated: 'Transliterated Metadata'
        },
        row: getTableRow(),
        updateMetadataData: updateMetadataRowListSpy,
        updateMetadataField: updateMetadataRowFieldSpy
      };

      // Call the function
      updateMetadataRow(args);
    });

    afterEach(function () {
      updateMetadataRowListSpy = null;
      updateMetadataRowFieldSpy = null;
      args = null;
    });

    it('should call `updateMetadataRowField` with the correct arguments', function () {
      expect(updateMetadataRowFieldSpy.calledOnceWithExactly({ field: args.data.field, row: args.row }), '`updateMetadataRowField` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateMetadataRowList` with the correct arguments', function () {
      expect(updateMetadataRowListSpy.calledOnceWithExactly({ original: args.data.original, row: args.row, transliterated: args.data.transliterated }), '`updateMetadataRowList` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('updateMetadataTable()', function () {
    let originalRow = null;
    let cloneMetadataRowStub = null;
    let updateMetadataRowSpy = null;
    let args = null;

    beforeEach(function () {
      originalRow = getTableRow();
      cloneMetadataRowStub = sinon.stub().returns(cloneMetadataRow({ row: originalRow }));
      updateMetadataRowSpy = sinon.spy();
      args = {
        cloneRow: cloneMetadataRowStub,
        metadata,
        table: getTable(),
        updateRow: updateMetadataRowSpy
      };

      // Check that the original row exists before testing
      expect(originalRow, 'the original row should exist before testing').to.not.be.null;

      // Check that the original row's `parentNode` exists before testing
      expect(originalRow.parentNode, 'the original row\'s parentNode should exist before testing').to.not.be.null;

      // Call the function
      updateMetadataTable(args);
    });

    afterEach(function () {
      originalRow = null;
      cloneMetadataRowStub = null;
      updateMetadataRowSpy = null;
      args = null;
    });

    it('should call `cloneMetadataRow` with the correct arguments for each metadata item', function () {
      args.metadata.forEach(() => {
        expect(cloneMetadataRowStub.calledOnceWithExactly({ row: originalRow }), '`cloneMetadataRow` should have been called with the correct arguments').to.be.true;
      });
    });

    it('should call `updateMetadataRow` with the correct arguments for each metadata item', function () {
      args.metadata.forEach((data) => {
        expect(updateMetadataRowSpy.calledOnceWithExactly({ data, row: cloneMetadataRowStub() }), '`updateMetadataRow` should have been called with the correct arguments').to.be.true;
      });
    });

    it('should update the metadata table with the correct number of rows', function () {
      expect(args.table.querySelectorAll('tbody > tr').length, '`updateMetadataTable` should update the metadata table').to.equal(args.metadata.length);
    });

    it('should remove the original row', function () {
      expect(originalRow.parentNode, 'the original row should have been removed').to.be.null;
    });
  });

  describe('updateMetadata()', function () {
    let getListItemMetadataTableStub = null;
    let prepareMetadataElementSpy = null;
    let updateMetadataTableSpy = null;
    let args = null;

    beforeEach(function () {
      getListItemMetadataTableStub = sinon.stub().callsFake(({ listItem }) => {
        return getListItemMetadataTable({ listItem });
      });
      prepareMetadataElementSpy = sinon.spy();
      updateMetadataTableSpy = sinon.spy();
      args = {
        getMetadataTable: getListItemMetadataTableStub,
        listItem: getListItem(),
        metadata,
        prepareElement: prepareMetadataElementSpy,
        updateTable: updateMetadataTableSpy
      };
    });

    afterEach(function () {
      getListItemMetadataTableStub = null;
      prepareMetadataElementSpy = null;
      updateMetadataTableSpy = null;
      args = null;
    });

    describe('table exists', function () {
      beforeEach(function () {
        // Check that the table exists
        expect(getListItemMetadataTable({ listItem: getListItem() }), 'the metadata table should exist').to.not.be.null;

        // Call the function
        updateMetadata(args);
      });

      it('should call `getListItemMetadataTable` with the correct arguments', function () {
        expect(getListItemMetadataTableStub.calledOnceWithExactly({ listItem: args.listItem }), '`getListItemMetadataTable` should have been called with the correct arguments').to.be.true;
      });

      it('should call `prepareMetadataElement` with the correct arguments', function () {
        expect(prepareMetadataElementSpy.calledOnceWithExactly({ listItem: args.listItem, table: getListItemMetadataTableStub({ listItem: args.listItem }) }), '`prepareMetadataElement` should have been called with the correct arguments').to.be.true;
      });

      it('should call `updateMetadataTable` with the correct arguments', function () {
        expect(updateMetadataTableSpy.calledOnceWithExactly({ listItem: args.listItem, metadata: args.metadata, table: getListItemMetadataTableStub({ listItem: args.listItem }) }), '`updateMetadataTable` should have been called with the correct arguments').to.be.true;
      });

      it('should remove the metadata table if there is no metadata', function () {
        // Make the `metadata` empty
        args.metadata = [];

        // Call the function again
        updateMetadata(args);

        // Check that the table was removed
        expect(getTable(), 'the metadata table should have been removed').to.be.null;
      });
    });

    describe('table does not exist', function () {
      beforeEach(function () {
        // Update the table's class
        getTable().setAttribute('class', 'some-other-class');

        // Check that the metadata table does not exist
        expect(getListItemMetadataTable({ listItem: getListItem() }), 'the metadata table should not exist').to.be.null;

        // Check that there is metadata
        expect(args.metadata.length, 'there should be metadata').to.be.greaterThan(0);

        // Call the function
        updateMetadata(args);
      });

      it('should not have called `prepareMetadataElement`', function () {
        expect(prepareMetadataElementSpy.notCalled, '`prepareMetadataElement` should have not been called').to.be.true;
      });

      it('should not have called `updateMetadataTable`', function () {
        expect(updateMetadataTableSpy.notCalled, '`updateMetadataTable` should have not been called').to.be.true;
      });
    });
  });
});
