import { listItem, listItemMetadata } from '../../../../../assets/scripts/datastores/list/partials/_list-item.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const nonEmptyDatastores = getDatastores({ list: global.temporaryList });
const recordIds = Object.keys(global.temporaryList[nonEmptyDatastores[0]]);

const listItemTitleHTML = `
  <h3 class="list__item--title">
    <span class="list__item--title-number">0.</span>
    <a href="http://example.com/" class="list__item--title-original">
      Original Title
    </a>
    <span class="list__item--title-transliterated h5">
      Transliterated Title
    </span>
  </h3>
`;
const listItemMetadataHTML = `
  <table class="metadata">
    <tbody>
      <tr class="metadata__row--clone">
        <th scope="row">
          Field
        </th>
        <td>
          <span class="metadata__data--original">
            Original Data
          </span>
          <span class="metadata__data--transliterated">
            Transliterated Data
          </span>
        </td>
      </tr>
    </tbody>
  </table>
`;

describe('listItem()', function () {
  describe('listItemMetadata()', function () {
    let args = null;
    let getRows = null;
    const [recordId] = recordIds;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItemMetadataHTML;

      args = {
        itemTable: document.querySelector('table.metadata > tbody'),
        metadata: global.temporaryList[nonEmptyDatastores[0]][recordId].metadata
      };

      getRows = () => {
        return args.itemTable.querySelectorAll('tr');
      };
    });

    afterEach(function () {
      args = null;
      getRows = null;
    });

    it('should clone the existing row for each piece of metadata', function () {
      // Check how many rows currently exist
      expect(getRows().length).to.equal(1);

      // Call the function
      listItemMetadata(args);

      // Check that the number of rows equals the amount of metadata
      expect(getRows().length, 'the number of rows should equal to the length of the given metadata').to.equal(args.metadata.length);
    });

    it('should remove the clone class', function () {
      // Check that every row has the clone class
      const hasCloneClass = () => {
        return [...getRows()].every((row) => {
          return row.classList?.contains('metadata__row--clone');
        });
      };

      // Check that the clone class currently exists
      expect(hasCloneClass(), 'the clone class should exist for each table row').to.be.true;

      // Call the function
      listItemMetadata(args);

      // Check that the clone class no longer exists
      expect(hasCloneClass(), 'the clone class should not longer exist for each table row').to.be.false;
    });

    it('should remove the `transliterated` element if it does not exist', function () {
      // Define the metadata row to check
      const index = 0;

      // Remove the metadata row's transliterated information from the args
      args.metadata[index].transliterated = '';

      // Call the function
      listItemMetadata(args);

      // Check that the metadata row does not have the transliterated element
      expect(getRows()[index].querySelector('.metadata__data--transliterated'), 'the metadata row should not have the transliterated element').to.be.null;
    });
  });

  describe('listItem()', function () {
    let args = null;
    let getListItem = null;
    let clone = null;
    const [recordId] = recordIds;
    const cloneClass = 'list__item--clone';

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <li class="container__rounded list__item list__item--clone">
          <div class="list__item--header">
            <input type="checkbox" class="record__checkbox" value="" aria-label="Select record">
            ${listItemTitleHTML}
          </div>
          ${listItemMetadataHTML}
        </li>
      `;

      args = {
        datastore: nonEmptyDatastores[0],
        index: 0,
        record: global.temporaryList[nonEmptyDatastores[0]][recordId],
        recordId,
        updates: {
          listItemMetadata: sinon.stub(),
          updateCheckboxLabel: sinon.spy(),
          updateCheckboxValue: sinon.spy(),
          updateListItemTitle: sinon.spy()
        }
      };

      getListItem = () => {
        return document.querySelector(`.list__item--clone`);
      };

      // Call the function
      clone = listItem(args);
    });

    afterEach(function () {
      args = null;
      getListItem = null;
      clone = null;
    });

    it('should clone the list item', function () {
      expect(clone, 'the clone should be a new node').to.not.deep.equal(getListItem());
    });

    it('should no longer have the cloned class', function () {
      expect(clone.classList.contains(cloneClass), `the list item should not have the \`${cloneClass}\` class`).to.be.false;
    });

    it('should set the `data-record-datastore` attribute', function () {
      expect(clone.getAttribute('data-record-datastore'), '`data-record-datastore` should be defined to the provided datastore').to.equal(args.datastore);
    });

    it('should set the `data-record-id` attribute', function () {
      expect(clone.getAttribute('data-record-id'), '`data-record-id` should be defined to the provided record ID').to.equal(args.recordId);
    });

    it('should call `updateCheckboxLabel` with the correct arguments', function () {
      expect(args.updates.updateCheckboxLabel.calledOnceWithExactly({ checkbox: clone.querySelector('input[type="checkbox"]'), title: args.record.title.original })).to.be.true;
    });

    it('should call `updateCheckboxValue` with the correct arguments', function () {
      expect(args.updates.updateCheckboxValue.calledOnceWithExactly({ checkbox: clone.querySelector('input[type="checkbox"]'), recordDatastore: args.datastore, recordId: args.recordId })).to.be.true;
    });

    it('should call `updateListItemTitle` with the correct arguments', function () {
      expect(args.updates.updateListItemTitle.calledOnceWithExactly({ index: args.index, listItem: clone, title: args.record.title, url: args.record.url })).to.be.true;
    });

    it('should call `listItemMetadata` with the correct arguments', function () {
      // Get the cloned title
      const itemTable = clone.querySelector('table.metadata > tbody');

      // Check that `listItemMetadata` was called
      expect(args.updates.listItemMetadata.calledOnce, '`listItemMetadata` should have been called once').to.be.true;

      // Get the arguments for `listItemMetadata`
      const [metadataArgs] = args.updates.listItemMetadata.firstCall.args;

      // Check that each argument is returning the correct value
      expect(metadataArgs.itemTable, '`itemTable` should have the correct value').to.equal(itemTable);
      expect(metadataArgs.metadata, '`metadata` should have the correct value').to.deep.equal(args.record.metadata);
    });

    it('should return the cloned node', function () {
      // Call the function by attaching it to the body
      document.body.appendChild(listItem(args));

      // Check that there are now more list items
      expect([...document.querySelectorAll('li')].length, 'there should be more than one list item').to.equal(2);
    });
  });
});
