import { expect } from 'chai';
import sinon from 'sinon';
import { updateListItemHeader } from '../../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/_header.js';

describe('list item header', function () {
  describe('updateListItemHeader()', function () {
    let updateListItemCheckboxSpy = null;
    let updateListItemTitleSpy = null;
    let args = null;

    beforeEach(function () {
      updateListItemCheckboxSpy = sinon.spy();
      updateListItemTitleSpy = sinon.spy();
      args = {
        index: 1,
        listItem: {},
        recordDatastore: 'datastore',
        recordId: '1337',
        title: {
          original: {
            text: 'Original Title'
          },
          text: null,
          transliterated: {
            text: 'Transliterated Title'
          }
        },
        updateCheckbox: updateListItemCheckboxSpy,
        updateTitle: updateListItemTitleSpy,
        url: 'http://example.com'
      };

      // Call the function
      updateListItemHeader(args);
    });

    afterEach(function () {
      updateListItemCheckboxSpy = null;
      updateListItemTitleSpy = null;
      args = null;
    });

    it('should call `updateListItemCheckbox` with the correct arguments', function () {
      expect(updateListItemCheckboxSpy.calledOnceWithExactly({ listItem: args.listItem, recordDatastore: args.recordDatastore, recordId: args.recordId, title: args.title.text ?? args.title.original.text }), '`updateListItemCheckbox` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateListItemTitle` with the correct arguments', function () {
      expect(updateListItemTitleSpy.calledOnceWithExactly({ index: args.index, listItem: args.listItem, title: args.title, url: args.url }), '`updateListItemTitle` should have been called with the correct arguments').to.be.true;
    });
  });
});
