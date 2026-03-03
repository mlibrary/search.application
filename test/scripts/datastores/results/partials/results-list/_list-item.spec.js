import {
  cloneListItem,
  getListItemPartial,
  updateListItem,
  updateListItemAttributes
} from '../../../../../../assets/scripts/datastores/results/partials/results-list/_list-item.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const [recordDatastore] = getDatastores({ list: global.temporaryList });
const [recordId] = Object.keys(global.temporaryList[recordDatastore]);

describe('List Item', function () {
  let getListItem = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ul>
        <li class="results__list-item" data-record-datastore="datastore" data-record-id="123">
          <div class="list__item--header">
            <input type="checkbox" class="record__checkbox" value="" aria-label="Select record">
          </div>
        </li>
      </ul>
    `;

    getListItem = () => {
      return document.querySelector('li');
    };
  });

  afterEach(function () {
    getListItem = null;
  });

  describe('getListItemPartial()', function () {
    it('should return the list item clone', function () {
      expect(getListItemPartial({ resultsList: document.querySelector('ul') }), '`getListItemPartial` should the list item clone').to.deep.equal(getListItem());
    });
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

    it('should update the `data-record-datastore` attribute', function () {
      expect(args.listItem.getAttribute('data-record-datastore'), `List item should have data-record-datastore attribute set to ${args.recordDatastore}`).to.equal(args.recordDatastore);
    });

    it('should update the `data-record-id` attribute', function () {
      expect(args.listItem.getAttribute('data-record-id'), `List item should have data-record-id attribute set to ${args.recordId}`).to.equal(args.recordId);
    });
  });

  describe('updateListItem()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        index: 0,
        listItem: getListItem(),
        listItemFuncs: {
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
      updateListItem(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should call `updateListItemAttributes` with the correct arguments', function () {
      expect(args.listItemFuncs.updateListItemAttributes.calledOnceWithExactly({ listItem: args.listItem, recordDatastore: args.recordDatastore, recordId: args.recordId }), '`updateListItemAttributes` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateCheckbox` with the correct arguments', function () {
      expect(args.listItemFuncs.updateCheckbox.calledOnceWithExactly({ listItem: args.listItem, recordDatastore: args.recordDatastore, recordId: args.recordId, title: args.record.title.original }), '`updateCheckbox` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItemTitle` with the correct arguments', function () {
      expect(args.listItemFuncs.updateListItemTitle.calledOnceWithExactly({ index: args.index, listItem: args.listItem, title: args.record.title, url: args.record.url }), '`updateListItemTitle` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateMetadata` with the correct arguments', function () {
      expect(args.listItemFuncs.updateMetadata.calledOnceWithExactly({ listItem: args.listItem, metadata: args.record.metadata }), '`updateMetadata` should have been called with the correct arguments').to.be.true;
    });
  });
});
