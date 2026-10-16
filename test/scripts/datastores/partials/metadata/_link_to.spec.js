import {
  appendLinkToMetadataPartial,
  cloneLinkToMetadataPartial,
  getLinkToMetadataPartial,
  updateLinkToMetadataPartial
} from '../../../../../assets/scripts/datastores/partials/metadata/_link_to.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('link_to metadata partial', function () {
  let getListItem = null;
  let getMetadataTable = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <table class="metadata">
      </table>
      <li class="results__list-item">
        <ul class="metadata__list--link_to" id="metadata__toggle--field-1337">
          <li>
            <ul class="list__no-style metadata__list--parallel">
              <li>
                <a href="/catalog?query=Original+Data">Original Data</a>
              </li>
              <li>
                <a href="/catalog?query=Transliterated+Data">Transliterated Data</a>
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

  describe('getLinkToMetadataPartial()', function () {
    it('should return the correct link_to metadata partial', function () {
      expect(getLinkToMetadataPartial({ listItem: getListItem() }), '`getLinkToMetadataPartial` should return the correct link_to metadata partial').to.equal(document.querySelector('.metadata__list--link_to'));
    });
  });

  describe('cloneLinkToMetadataPartial()', function () {
    let getLinkToMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      getLinkToMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return getLinkToMetadataPartial({ listItem });
      });
      args = {
        getLinkToPartial: getLinkToMetadataPartialStub,
        listItem: getListItem()
      };

      // Call the function
      cloneLinkToMetadataPartial(args);
    });

    afterEach(function () {
      getLinkToMetadataPartialStub = null;
      args = null;
    });

    it('should call `getLinkToMetadataPartial` with the correct arguments', function () {
      expect(getLinkToMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`getLinkToMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should clone the partial', function () {
      expect(cloneLinkToMetadataPartial({ listItem: args.listItem }).isEqualNode(getLinkToMetadataPartial({ listItem: args.listItem })), '`cloneMetadataRow` should clone the metadata row').to.be.true;
    });
  });

  describe('updateLinkToMetadataPartial()', function () {
    let cloneLinkToMetadataPartialSpy = null;
    let args = null;

    beforeEach(function () {
      cloneLinkToMetadataPartialSpy = sinon.spy();
      args = {
        clonedLinkToPartial: cloneLinkToMetadataPartialSpy,
        listItem: getListItem()
      };

      // Call the function
      updateLinkToMetadataPartial(args);
    });

    afterEach(function () {
      cloneLinkToMetadataPartialSpy = null;
      args = null;
    });

    it('should call `cloneLinkToMetadataPartial` with the correct arguments', function () {
      expect(cloneLinkToMetadataPartialSpy.calledOnceWithExactly({ listItem: args.listItem }), '`cloneLinkToMetadataPartial` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('appendLinkToMetadataPartial()', function () {
    let updateLinkToMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      updateLinkToMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return updateLinkToMetadataPartial({ listItem });
      });
      args = {
        listItem: getListItem(),
        metadataTable: getMetadataTable(),
        updateLinkToPartial: updateLinkToMetadataPartialStub
      };

      // Call the function
      appendLinkToMetadataPartial(args);
    });

    afterEach(function () {
      updateLinkToMetadataPartialStub = null;
      args = null;
    });

    it('should call `updateLinkToMetadataPartial` with the correct arguments', function () {
      expect(updateLinkToMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`updateLinkToMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should append the cloned partial to the metadata table', function () {
      expect(args.metadataTable.contains(updateLinkToMetadataPartialStub.returnValues[0]), '`appendLinkToMetadataPartial` should append the cloned partial to the metadata table').to.be.true;
    });
  });
});
