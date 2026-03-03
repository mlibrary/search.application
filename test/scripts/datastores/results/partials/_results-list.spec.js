import { cloneListItem, getListItemPartial } from '../../../../../assets/scripts/datastores/results/partials/results-list/_list-item.js';
import {
  createRecordItem,
  createRecordItems,
  getResultsList,
  updateResultsList,
  updateResultsLists
} from '../../../../../assets/scripts/datastores/results/partials/_results-list.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const nonEmptyDatastores = getDatastores({ list: global.temporaryList });

describe('Results list', function () {
  let getList = null;
  const [nonEmptyDatastore] = nonEmptyDatastores;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = nonEmptyDatastores.map((datastore) => {
      return `<div class="list__${datastore}">
                <ul class="results__list">
                  <li class="results__list-item" data-record-datastore="datastore" data-record-id="123"></li>
                </ul>
              </div>`;
    }).join('');

    getList = () => {
      return document.querySelector('.results__list');
    };
  });

  afterEach(function () {
    getList = null;
  });

  describe('getResultsList()', function () {
    it('should return the correct results list element', function () {
      expect(getResultsList({ recordDatastore: nonEmptyDatastore }), '`getResultsList` should return the correct element').to.deep.equal(getList());
    });
  });

  describe('createRecordItem()', function () {
    let cloneListItemStub = null;
    let updateListItemSpy = null;
    let args = null;

    beforeEach(function () {
      cloneListItemStub = sinon.stub().callsFake(({ listItem }) => {
        return cloneListItem({ listItem });
      });
      updateListItemSpy = sinon.spy();
      args = {
        cloneItem: cloneListItemStub,
        index: 0,
        originalListItem: getList().querySelector('.results__list-item'),
        record: global.temporaryList[nonEmptyDatastore][0],
        recordDatastore: nonEmptyDatastore,
        recordId: Object.keys(global.temporaryList[nonEmptyDatastore])[0],
        resultsList: getList(),
        updateItem: updateListItemSpy
      };

      // Call the function
      createRecordItem(args);
    });

    afterEach(function () {
      cloneListItemStub = null;
      updateListItemSpy = null;
      args = null;
    });

    it('should call `cloneListItem` with the correct arguments', function () {
      expect(cloneListItemStub.calledWith({ listItem: args.originalListItem }), '`cloneListItem` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItem` with the correct arguments', function () {
      expect(updateListItemSpy.calledWith({
        index: args.index,
        listItem: cloneListItemStub.returnValues[0],
        record: args.record,
        recordDatastore: args.recordDatastore,
        recordId: args.recordId
      }), '`updateListItem` should have been called with the correct arguments').to.be.true;
    });

    it('should append the cloned list item in the results list', function () {
      expect(args.resultsList.contains(cloneListItemStub.returnValues[0]), '`resultsList` should contain the cloned list item').to.be.true;
    });
  });

  describe('createRecordItems()', function () {
    let createRecordItemSpy = null;
    let args = null;

    beforeEach(function () {
      createRecordItemSpy = sinon.spy();
      args = {
        createRecord: createRecordItemSpy,
        datastoreList: global.temporaryList[nonEmptyDatastore],
        originalListItem: getList().querySelector('.results__list-item'),
        recordDatastore: nonEmptyDatastore,
        resultsList: getList()
      };

      // Call the function
      createRecordItems(args);
    });

    afterEach(function () {
      createRecordItemSpy = null;
      args = null;
    });

    it('should call `createRecordItem` for each record in the datastore with the correct arguments', function () {
      Object.keys(args.datastoreList).forEach((recordId, index) => {
        expect(createRecordItemSpy.calledWith({
          index,
          originalListItem: args.originalListItem,
          record: args.datastoreList[recordId],
          recordDatastore: args.recordDatastore,
          recordId,
          resultsList: args.resultsList
        }), '`createRecordItem` should have been called with the correct arguments').to.be.true;
      });
    });
  });

  describe('updateResultsList()', function () {
    let getResultsListStub = null;
    let getListItemPartialStub = null;
    let createRecordItemsSpy = null;
    let args = null;
    let originalListItem = null;

    beforeEach(function () {
      getResultsListStub = sinon.stub().callsFake(({ recordDatastore }) => {
        return getResultsList({ recordDatastore });
      });
      getListItemPartialStub = sinon.stub().callsFake(({ resultsList }) => {
        return getListItemPartial({ resultsList });
      });
      createRecordItemsSpy = sinon.spy();
      args = {
        createRecords: createRecordItemsSpy,
        datastoreList: global.temporaryList[nonEmptyDatastore],
        getDatastoreList: getResultsListStub,
        getListItem: getListItemPartialStub,
        recordDatastore: nonEmptyDatastore
      };
      originalListItem = () => {
        return getResultsList({ recordDatastore: args.recordDatastore }).querySelector('li.results__list-item');
      };
    });

    afterEach(function () {
      getResultsListStub = null;
      getListItemPartialStub = null;
      createRecordItemsSpy = null;
      args = null;
      originalListItem = null;
    });

    describe('results list exists', function () {
      beforeEach(function () {
        // Check that the original list item exists before testing
        expect(originalListItem(), 'the original list item should exist before testing').to.exist;

        // Call the function
        updateResultsList(args);
      });

      it('should call `getResultsList` with the correct arguments', function () {
        expect(getResultsListStub.calledWith({ recordDatastore: args.recordDatastore }), '`getResultsList` should have been called with the correct arguments').to.be.true;
      });

      it('should call `getListItemPartial` with the correct arguments', function () {
        expect(getListItemPartialStub.calledWith({ resultsList: args.getDatastoreList({ recordDatastore: args.recordDatastore }) }), '`getListItemPartial` should have been called with the correct arguments').to.be.true;
      });

      it('should call `createRecordItems` with the correct arguments', function () {
        expect(createRecordItemsSpy.calledWith({
          datastoreList: args.datastoreList,
          originalListItem: getListItemPartialStub.returnValues[0],
          recordDatastore: args.recordDatastore,
          resultsList: args.getDatastoreList({ recordDatastore: args.recordDatastore })
        }), '`createRecordItems` should have been called with the correct arguments').to.be.true;
      });

      it('should remove the original list item', function () {
        expect(originalListItem(), 'the original list item should have been removed').to.not.exist;
      });
    });

    describe('results list does not exist', function () {
      beforeEach(function () {
        // Check that the results list does not exist before testing
        args.recordDatastore = 'non-existent-datastore';
        expect(getResultsList({ recordDatastore: args.recordDatastore }), 'the results list should not exist before testing').to.not.exist;

        // Call the function
        updateResultsList(args);
      });

      it('should call `getResultsList` with the correct arguments', function () {
        expect(getResultsListStub.calledWith({ recordDatastore: args.recordDatastore }), '`getResultsList` should have been called with the correct arguments').to.be.true;
      });

      it('should not call `getListItemPartial`', function () {
        expect(getListItemPartialStub.notCalled, '`getListItemPartial` should not have been called').to.be.true;
      });

      it('should not call `createRecordItems`', function () {
        expect(createRecordItemsSpy.notCalled, '`createRecordItems` should not have been called').to.be.true;
      });
    });
  });

  describe('updateResultsLists()', function () {
    let getDatastoresStub = null;
    let updateResultsListSpy = null;
    let args = null;

    beforeEach(function () {
      getDatastoresStub = sinon.stub().callsFake(({ list }) => {
        return getDatastores({ list });
      });
      updateResultsListSpy = sinon.spy();
      args = {
        datastores: getDatastoresStub,
        list: global.temporaryList,
        updateList: updateResultsListSpy
      };

      // Call the function
      updateResultsLists(args);
    });

    afterEach(function () {
      getDatastoresStub = null;
      updateResultsListSpy = null;
      args = null;
    });

    it('should call `getDatastores` with the correct arguments', function () {
      expect(getDatastoresStub.calledWith({ list: args.list }), '`getDatastores` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateResultsList` with the correct arguments for each datastore', function () {
      getDatastoresStub({ list: args.list }).forEach((recordDatastore) => {
        expect(updateResultsListSpy.calledWith({ datastoreList: args.list[recordDatastore], recordDatastore }), `\`updateResultsList\` should have been called with the correct arguments for \`${recordDatastore}\``).to.be.true;
      });
    });
  });
});
