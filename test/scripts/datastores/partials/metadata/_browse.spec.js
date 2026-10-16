import {
  appendBrowseMetadataPartial,
  cloneBrowseMetadataPartial,
  getBrowseMetadataPartial,
  updateBrowseMetadataPartial
} from '../../../../../assets/scripts/datastores/partials/metadata/_browse.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('browse metadata partial', function () {
  let getListItem = null;
  let getMetadataTable = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <table class="metadata">
      </table>
      <li class="results__list-item">
        <ul class="metadata__list--browse" id="metadata__toggle--field-1337">
          <li>
            <ul class="list__no-style metadata__list--parallel">
              <li>
                <a href="/catalog?query=author:(Original+Data)">Original Data</a>
                <span class="metadata__list--browse-link">
                  <a href="/catalog/browse/author?query=Original+Data">Browse in author list</a>
                </span>
              </li>
              <li>
                <a href="/catalog?query=author:(Transliterated+Data)">Transliterated Data</a>
                <span class="metadata__list--browse-link">
                  <a href="/catalog/browse/author?query=Transliterated+Data">Browse in author list</a>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    `;

    getListItem = () => {
      return document.querySelector('.results__list-item');
    };
    getMetadataTable = () => {
      return document.querySelector('.metadata');
    };
  });

  afterEach(function () {
    getListItem = null;
    getMetadataTable = null;
  });

  describe('getBrowseMetadataPartial()', function () {
    it('should return the correct browse metadata partial', function () {
      expect(getBrowseMetadataPartial({ listItem: getListItem() }), '`getBrowseMetadataPartial` should return the correct browse metadata partial').to.equal(document.querySelector('.metadata__list--browse'));
    });
  });

  describe('cloneBrowseMetadataPartial()', function () {
    let getBrowseMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      getBrowseMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return getBrowseMetadataPartial({ listItem });
      });
      args = {
        getBrowsePartial: getBrowseMetadataPartialStub,
        listItem: getListItem()
      };

      // Call the function
      cloneBrowseMetadataPartial(args);
    });

    afterEach(function () {
      getBrowseMetadataPartialStub = null;
      args = null;
    });

    it('should call `getBrowseMetadataPartial` with the correct arguments', function () {
      expect(getBrowseMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`getBrowseMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should clone the partial', function () {
      expect(cloneBrowseMetadataPartial({ listItem: args.listItem }).isEqualNode(getBrowseMetadataPartial({ listItem: args.listItem })), '`cloneMetadataRow` should clone the metadata row').to.be.true;
    });
  });

  describe('updateBrowseMetadataPartial()', function () {
    let cloneBrowseMetadataPartialSpy = null;
    let args = null;

    beforeEach(function () {
      cloneBrowseMetadataPartialSpy = sinon.spy();
      args = {
        clonedBrowsePartial: cloneBrowseMetadataPartialSpy,
        listItem: getListItem()
      };

      // Call the function
      updateBrowseMetadataPartial(args);
    });

    afterEach(function () {
      cloneBrowseMetadataPartialSpy = null;
      args = null;
    });

    it('should call `cloneBrowseMetadataPartial` with the correct arguments', function () {
      expect(cloneBrowseMetadataPartialSpy.calledOnceWithExactly({ listItem: args.listItem }), '`cloneBrowseMetadataPartial` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('appendBrowseMetadataPartial()', function () {
    let updateBrowseMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      updateBrowseMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return updateBrowseMetadataPartial({ listItem });
      });
      args = {
        listItem: getListItem(),
        metadataTable: getMetadataTable(),
        updateBrowsePartial: updateBrowseMetadataPartialStub
      };

      // Call the function
      appendBrowseMetadataPartial(args);
    });

    afterEach(function () {
      updateBrowseMetadataPartialStub = null;
      args = null;
    });

    it('should call `updateBrowseMetadataPartial` with the correct arguments', function () {
      expect(updateBrowseMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`updateBrowseMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should append the cloned partial to the metadata table', function () {
      expect(args.metadataTable.contains(updateBrowseMetadataPartialStub.returnValues[0]), '`appendBrowseMetadataPartial` should append the cloned partial to the metadata table').to.be.true;
    });
  });
});
