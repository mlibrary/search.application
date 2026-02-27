import {
  cloneListItem,
  listItem,
  updateListItemAttributes
} from '../../../../../../assets/scripts/datastores/results/partials/results-list/_list-item.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const [recordDatastore] = getDatastores({ list: global.temporaryList });
const [recordId] = Object.keys(global.temporaryList[recordDatastore]);

describe('List Item', function () {
  let getListItem = null;
  const listItemClass = 'list__item--clone';

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <li class="${listItemClass}" data-record-datastore="datastore" data-record-id="123">
        <div class="list__item--header">
          <input type="checkbox" class="record__checkbox" value="" aria-label="Select record">
        </div>
      </li>
    `;

    getListItem = () => {
      return document.querySelector('li');
    };
  });

  afterEach(function () {
    getListItem = null;
  });

  describe('cloneListItem()', function () {
    it('should clone a list item', function () {
      expect(cloneListItem({ listItem: getListItem() }), '`cloneListItem` should return a new element').to.not.equal(getListItem());
    });
  });

  describe('updateListItemAttributes()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        listItem: getListItem(),
        recordDatastore,
        recordId
      };

      // Call the function
      updateListItemAttributes(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should remove the list item class', function () {
      expect(args.listItem.classList.contains(listItemClass), `List item should not have class ${listItemClass}`).to.be.false;
    });

    it('should update the `data-record-datastore` attribute', function () {
      expect(args.listItem.getAttribute('data-record-datastore'), `List item should have data-record-datastore attribute set to ${args.recordDatastore}`).to.equal(args.recordDatastore);
    });

    it('should update the `data-record-id` attribute', function () {
      expect(args.listItem.getAttribute('data-record-id'), `List item should have data-record-id attribute set to ${args.recordId}`).to.equal(args.recordId);
    });
  });

  describe('listItem()', function () {
    let args = null;
    let clone = null;

    beforeEach(function () {
      args = {
        datastore: recordDatastore,
        index: 0,
        record: global.temporaryList[recordDatastore][recordId],
        recordId,
        updates: {
          cloneListItem: sinon.stub().returns(getListItem().cloneNode(true)),
          updateCheckboxLabel: sinon.spy(),
          updateCheckboxValue: sinon.spy(),
          updateListItemAttributes: sinon.spy(),
          updateListItemTitle: sinon.spy(),
          updateMetadata: sinon.spy()
        }
      };

      // Call the function
      clone = listItem(args);
    });

    afterEach(function () {
      args = null;
      clone = null;
    });

    it('should call `cloneListItem` with the correct arguments', function () {
      expect(args.updates.cloneListItem.calledOnceWithExactly({ listItem: getListItem() }), '`cloneListItem` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItemAttributes` with the correct arguments', function () {
      expect(args.updates.updateListItemAttributes.calledOnceWithExactly({ listItem: clone, recordDatastore: args.datastore, recordId: args.recordId }), '`updateListItemAttributes` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateCheckboxLabel` with the correct arguments', function () {
      expect(args.updates.updateCheckboxLabel.calledOnceWithExactly({ checkbox: clone.querySelector('input[type="checkbox"]'), title: args.record.title.original }), '`updateCheckboxLabel` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateCheckboxValue` with the correct arguments', function () {
      expect(args.updates.updateCheckboxValue.calledOnceWithExactly({ checkbox: clone.querySelector('input[type="checkbox"]'), recordDatastore: args.datastore, recordId: args.recordId }), '`updateCheckboxValue` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItemTitle` with the correct arguments', function () {
      expect(args.updates.updateListItemTitle.calledOnceWithExactly({ index: args.index, listItem: clone, title: args.record.title, url: args.record.url }), '`updateListItemTitle` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateMetadata` with the correct arguments', function () {
      expect(args.updates.updateMetadata.calledOnceWithExactly({ listItem: clone, metadata: args.record.metadata }), '`updateMetadata` should have been called with the correct arguments').to.be.true;
    });

    it('should clone the list item', function () {
      expect(clone, 'the clone should be a new node').to.not.deep.equal(getListItem());
    });
  });
});
