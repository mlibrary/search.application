import {
  createMetadataTableRow,
  createMetadataTableRowDataCell,
  createMetadataTableRowDataCellList,
  createMetadataTableRowHeader,
  getListItemMetadataTable,
  metadataHasManyValues,
  updateMetadata
} from '../../../../assets/scripts/datastores/partials/_metadata.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

// Create a shallow copy of the temporary list
const list = { ...global.temporaryList };
// Grab the second non-empty datastore
const [datastore] = getDatastores({ list }).slice(1);
// Grab the first record from the non-empty datastore
const [record] = Object.values(list[datastore]);
// Grab the metadata from that record
const { metadata } = record;

describe('metadata', function () {
  let getListItem = null;
  let getTable = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <li class="results__list-item">
        <table class="metadata">
          <tbody>
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
  });

  afterEach(function () {
    getListItem = null;
    getTable = null;
  });

  describe('getListItemMetadataTable()', function () {
    it('should return the correct metadata table', function () {
      expect(getListItemMetadataTable({ listItem: getListItem() }), '`getListItemMetadataTable` should return the correct metadata table').to.deep.equal(getTable());
    });
  });

  describe('createMetadataTableRowDataCellList()', function () {
    let args = null;
    let tbody = null;
    let tr = null;
    let td = null;
    let getList = null;
    let getListItems = null;

    beforeEach(function () {
      args = {
        data: metadata[0]
      };

      // Get the tbody element within the metadata table
      tbody = getTable().querySelector('tbody');
      // Create a table row
      tr = document.createElement('tr');
      // Create a table cell
      td = document.createElement('td');
      // Append the row to the tbody
      tbody.appendChild(tr);
      // Append the cell to the row
      tr.appendChild(td);

      getList = () => {
        return td.querySelector('ul');
      };

      getListItems = () => {
        return td.querySelectorAll('ul.metadata__list > li');
      };

      // Check that the list does not already exist
      expect(getList(), 'the list should not exist initially').to.be.null;

      // Append the metadata list to the cell
      td.appendChild(createMetadataTableRowDataCellList(args));
    });

    afterEach(function () {
      args = null;
      tbody = null;
      tr = null;
      td = null;
      getList = null;
      getListItems = null;
    });

    it('should create a list element', function () {
      expect(getList(), 'the list should exist after calling the function').to.not.be.null;
    });

    it('should assign the correct classes to the list element', function () {
      ['list__no-style', 'metadata__list', `metadata__list--${args.data.partial}`].forEach((className) => {
        expect(getList().classList.contains(className), `the UL should have the class ${className}`).to.be.true;
      });
    });

    it('should create a list item for each metadata value', function () {
      expect(getListItems().length, 'the number of list items should match the number of metadata values').to.equal(args.data.values.length);
    });

    it('should include the correct metadata values in the list items', function () {
      getListItems().forEach((li, index) => {
        const getValue = args.data.values[index];
        if (getValue.transliterated) {
          const getParellelList = li.querySelector('ul');
          // Check if a list element was created
          expect(getParellelList, `the list item at index ${index} should contain a nested list`).to.not.be.null;
          // Check if the nested list contains the correct values
          ['original', 'transliterated'].forEach((key) => {
            const value = getValue[key];
            if (value) {
              expect(getParellelList.textContent, `the nested list should contain the ${key} value`).to.include(value.text);
            }
          });
        } else {
          expect(li.textContent, `the list item at index ${index} should have the correct text`).to.equal(getValue.original ? getValue.original.text : getValue.text);
        }
      });
    });

    describe('has transliteration', function () {
      beforeEach(function () {
        // Check if the metadata values include transliteration
        expect(args.data.values.some((value) => {
          return value.transliterated;
        }), 'the metadata should have a transliterated value').to.be.true;
      });
    });

    describe('no transliteration', function () {
      beforeEach(function () {
        // Check if the metadata values do not include transliteration
        expect(args.data.values.some((value) => {
          return value.transliterated;
        }), 'the metadata should not have a transliterated value').to.be.false;
      });
    });
  });

  describe('createMetadataTableRowDataCell()', function () {
    let createMetadataTableRowDataCellListStub = null;
    let args = null;
    let getTableRowCell = null;

    beforeEach(function () {
      createMetadataTableRowDataCellListStub = sinon.stub().callsFake(({ data }) => {
        return createMetadataTableRowDataCellList({ data });
      });
      args = {
        createTableRowDataCellList: createMetadataTableRowDataCellListStub,
        data: metadata[0],
        row: document.createElement('tr')
      };

      // Get table row cell for later assertions
      getTableRowCell = () => {
        return args.row.querySelector('td');
      };

      // Check that a table cell does not already exist in the row
      expect(getTableRowCell(), 'the row should not have any cell cells initially').to.be.null;

      // Call the function
      createMetadataTableRowDataCell(args);
    });

    afterEach(function () {
      createMetadataTableRowDataCellListStub = null;
      args = null;
      getTableRowCell = null;
    });

    it('should create a table cell in the row', function () {
      expect(getTableRowCell(), 'the table cell should exist').to.not.be.null;
    });

    it('should call `createMetadataTableRowDataCellList` with the correct arguments', function () {
      expect(createMetadataTableRowDataCellListStub.calledOnceWithExactly({ data: args.data }), '`createMetadataTableRowDataCellList` should have been called once with the correct arguments').to.be.true;
    });

    it('should append the created list to the table cell', function () {
      expect(getTableRowCell().querySelector('ul'), 'the table cell should contain the created UL').to.not.be.null;
    });
  });

  describe('createMetadataTableRowHeader()', function () {
    let args = null;
    let getTableRowHeader = null;

    beforeEach(function () {
      args = {
        field: 'Test Field',
        row: document.createElement('tr')
      };

      // Get table row header for later assertions
      getTableRowHeader = () => {
        return args.row.querySelector('th');
      };

      // Check that a table header does not already exist in the row
      expect(getTableRowHeader(), 'the row should not have any header cells initially').to.be.null;

      // Call the function
      createMetadataTableRowHeader(args);
    });

    afterEach(function () {
      args = null;
      getTableRowHeader = null;
    });

    it('should create a table header in the row', function () {
      expect(getTableRowHeader(), 'the table header should exist').to.not.be.null;
    });

    it('should define the scope attribute for the table header', function () {
      expect(getTableRowHeader().getAttribute('scope'), 'the table header should have the scope attribute set to "row"').to.equal('row');
    });

    it('should set the text content of the table header to the field value', function () {
      expect(getTableRowHeader().textContent, 'the table header should have the correct text content').to.equal(args.field);
    });
  });

  describe('createMetadataTableRow()', function () {
    let createMetadataTableRowDataCellSpy = null;
    let createMetadataTableRowHeaderSpy = null;
    let args = null;

    beforeEach(function () {
      createMetadataTableRowDataCellSpy = sinon.spy();
      createMetadataTableRowHeaderSpy = sinon.spy();
      args = {
        createTableRowDataCell: createMetadataTableRowDataCellSpy,
        createTableRowHeader: createMetadataTableRowHeaderSpy,
        data: metadata[0],
        table: getTable()
      };

      // Check that a row does not already exist in the table
      expect(args.table.querySelector('tr'), 'the table should not have any rows initially').to.be.null;

      // Call the function
      createMetadataTableRow(args);
    });

    afterEach(function () {
      createMetadataTableRowDataCellSpy = null;
      createMetadataTableRowHeaderSpy = null;
      args = null;
    });

    it('should call `createMetadataTableRowHeader` with the correct arguments', function () {
      expect(createMetadataTableRowHeaderSpy.calledOnceWithExactly({ field: args.data.field, row: args.table.querySelector('tr') }), '`createMetadataTableRowHeader` should have been called with the correct arguments').to.be.true;
    });

    it('should call `createMetadataTableRowDataCell` with the correct arguments', function () {
      expect(createMetadataTableRowDataCellSpy.calledOnceWithExactly({ data: args.data, row: args.table.querySelector('tr') }), '`createMetadataTableRowDataCell` should have been called with the correct arguments').to.be.true;
    });

    it('should create the row', function () {
      const row = args.table.querySelector('tr');
      expect(row, 'the created row should exist').to.not.be.null;
    });
  });

  describe('metadataHasManyValues()', function () {
    let args = null;

    beforeEach(function () {
      args = { shown: 3, total: 3 };
    });

    afterEach(function () {
      args = null;
    });

    it('should return null if `total` is less than or equal to `shown`', function () {
      // Check that `total` is less than or equal to `shown`
      expect(args.total, '`total` should be less than or equal to `shown`').to.be.at.most(args.shown);
      // Call the function and check that it returns `null`
      expect(metadataHasManyValues(args), '`metadataHasManyValues` should return `null` when `total` is less than or equal to `shown`').to.be.null;
    });

    it('should return a list item if `total` is greater than `shown`', function () {
      // Set `total` to be greater than `shown`
      args.total = args.shown + 1;
      // Check that `total` is now greater than `shown`
      expect(args.total, '`total` should be greater than `shown`').to.be.above(args.shown);
      // Assign the result of the function to a variable
      const result = metadataHasManyValues(args);
      // Check that the function returns a list item
      expect(result.tagName, '`metadataHasManyValues` should return a list item when `total` is greater than `shown`').to.equal('LI');
      // Check that the text content is correct
      expect(result.textContent).to.equal(`... and ${args.total - args.shown} more.`);
    });
  });

  describe('updateMetadata()', function () {
    let createMetadataTableRowSpy = null;
    let getListItemMetadataTableStub = null;
    let args = null;

    beforeEach(function () {
      createMetadataTableRowSpy = sinon.spy();
      getListItemMetadataTableStub = sinon.stub().callsFake(({ listItem }) => {
        return getListItemMetadataTable({ listItem });
      });
      args = {
        createTableRow: createMetadataTableRowSpy,
        getMetadataTable: getListItemMetadataTableStub,
        listItem: getListItem(),
        metadata
      };

      // Call the function
      updateMetadata(args);
    });

    afterEach(function () {
      createMetadataTableRowSpy = null;
      getListItemMetadataTableStub = null;
      args = null;
    });

    it('should call `getListItemMetadataTable` with the correct arguments', function () {
      expect(getListItemMetadataTableStub.calledOnceWithExactly({ listItem: args.listItem }), '`getListItemMetadataTable` should have been called once with the correct arguments').to.be.true;
    });

    it('should return early if there is no table', function () {
      // Make the table not exist
      getTable().setAttribute('class', 'some-other-class');

      // Ensure the table is not found
      expect(getListItemMetadataTable({ listItem: args.listItem }), 'the metadata table should not exist before update').to.be.null;

      // Check that the function returns early
      expect(() => {
        return updateMetadata(args);
      }, '`updateMetadata` should return early if there is no table').to.not.throw();

      // Reset the table class to its original value
      getTable().setAttribute('class', 'metadata-table');
    });

    it('should remove the table if there is no metadata', function () {
      // Check that the table exists before removing metadata
      expect(getListItemMetadataTable({ listItem: args.listItem }), 'the metadata table should exist before update').to.not.be.null;

      // Set the metadata to an empty array
      args.metadata = [];

      // Call the function again
      updateMetadata(args);

      // Check that the table was removed
      expect(getListItemMetadataTable({ listItem: args.listItem }), 'the metadata table should not exist after update').to.be.null;
    });

    it('should call `createMetadataTableRow` with the correct arguments for each metadata item', function () {
      // Loop through each metadata item
      args.metadata.forEach((metadataItem) => {
        // Check that `createMetadataTableRow` is called with the correct arguments
        expect(createMetadataTableRowSpy.calledWithExactly({ data: metadataItem, table: args.getMetadataTable({ listItem: args.listItem }) }), '`createMetadataTableRow` should be called with the correct arguments').to.be.true;
      });
    });
  });
});
