import {
  clonedListItem,
  cloneListItem,
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

  describe('clonedListItem()', function () {
    let args = null;
    let listItem = null;

    beforeEach(function () {
      args = {
        index: 0,
        listItemFuncs: {
          cloneListItem: sinon.stub().returns(getListItem().cloneNode(true)),
          updateCheckbox: sinon.spy(),
          updateListItemAttributes: sinon.spy(),
          updateListItemTitle: sinon.spy(),
          updateMetadata: sinon.spy()
        },
        record: global.temporaryList[recordDatastore][recordId],
        recordDatastore,
        recordId
      };

      // Call the function
      listItem = clonedListItem(args);
    });

    afterEach(function () {
      args = null;
      listItem = null;
    });

    it('should call `cloneListItem` with the correct arguments', function () {
      expect(args.listItemFuncs.cloneListItem.calledOnceWithExactly({ listItem: getListItem() }), '`cloneListItem` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItemAttributes` with the correct arguments', function () {
      expect(args.listItemFuncs.updateListItemAttributes.calledOnceWithExactly({ listItem, recordDatastore: args.recordDatastore, recordId: args.recordId }), '`updateListItemAttributes` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateCheckbox` with the correct arguments', function () {
      expect(args.listItemFuncs.updateCheckbox.calledOnceWithExactly({ listItem, recordDatastore: args.recordDatastore, recordId: args.recordId, title: args.record.title.original }), '`updateCheckbox` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItemTitle` with the correct arguments', function () {
      expect(args.listItemFuncs.updateListItemTitle.calledOnceWithExactly({ index: args.index, listItem, title: args.record.title, url: args.record.url }), '`updateListItemTitle` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateMetadata` with the correct arguments', function () {
      expect(args.listItemFuncs.updateMetadata.calledOnceWithExactly({ listItem, metadata: args.record.metadata }), '`updateMetadata` should have been called with the correct arguments').to.be.true;
    });

    it('should clone the list item', function () {
      expect(listItem, 'the clone should be a new node').to.not.deep.equal(getListItem());
    });
  });
});
