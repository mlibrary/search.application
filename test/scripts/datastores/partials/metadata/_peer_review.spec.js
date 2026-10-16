import {
  appendPeerReviewMetadataPartial,
  clonePeerReviewMetadataPartial,
  getPeerReviewMetadataPartial,
  updatePeerReviewMetadataPartial
} from '../../../../../assets/scripts/datastores/partials/metadata/_peer_review.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('peer review metadata partial', function () {
  let getListItem = null;
  let getMetadataTable = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <table class="metadata">
      </table>
      <li class="results__list-item">
        <ul class="metadata__list--peer_review" id="metadata__toggle--field-1337">
          <li>
            <ul class="list__no-style metadata__list--parallel">
              <li>
                Original Data
                <span class="metadata__peer-review">
                  <span class="material-symbols-rounded" aria-hidden="true">
                    verified
                  </span><span>Peer-reviewed publication</span>
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

  describe('getPeerReviewMetadataPartial()', function () {
    it('should return the correct peer review metadata partial', function () {
      expect(getPeerReviewMetadataPartial({ listItem: getListItem() }), '`getPeerReviewMetadataPartial` should return the correct peer review metadata partial').to.equal(document.querySelector('.metadata__list--peer_review'));
    });
  });

  describe('clonePeerReviewMetadataPartial()', function () {
    let getPeerReviewMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      getPeerReviewMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return getPeerReviewMetadataPartial({ listItem });
      });
      args = {
        getPeerReviewPartial: getPeerReviewMetadataPartialStub,
        listItem: getListItem()
      };

      // Call the function
      clonePeerReviewMetadataPartial(args);
    });

    afterEach(function () {
      getPeerReviewMetadataPartialStub = null;
      args = null;
    });

    it('should call `getPeerReviewMetadataPartial` with the correct arguments', function () {
      expect(getPeerReviewMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`getPeerReviewMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should clone the partial', function () {
      expect(clonePeerReviewMetadataPartial({ listItem: args.listItem }).isEqualNode(getPeerReviewMetadataPartial({ listItem: args.listItem })), '`cloneMetadataRow` should clone the metadata row').to.be.true;
    });
  });

  describe('updatePeerReviewMetadataPartial()', function () {
    let clonePeerReviewMetadataPartialSpy = null;
    let args = null;

    beforeEach(function () {
      clonePeerReviewMetadataPartialSpy = sinon.spy();
      args = {
        clonedPeerReviewPartial: clonePeerReviewMetadataPartialSpy,
        listItem: getListItem()
      };

      // Call the function
      updatePeerReviewMetadataPartial(args);
    });

    afterEach(function () {
      clonePeerReviewMetadataPartialSpy = null;
      args = null;
    });

    it('should call `clonePeerReviewMetadataPartial` with the correct arguments', function () {
      expect(clonePeerReviewMetadataPartialSpy.calledOnceWithExactly({ listItem: args.listItem }), '`clonePeerReviewMetadataPartial` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('appendPeerReviewMetadataPartial()', function () {
    let updatePeerReviewMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      updatePeerReviewMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return updatePeerReviewMetadataPartial({ listItem });
      });
      args = {
        listItem: getListItem(),
        metadataTable: getMetadataTable(),
        updatePeerReviewPartial: updatePeerReviewMetadataPartialStub
      };

      // Call the function
      appendPeerReviewMetadataPartial(args);
    });

    afterEach(function () {
      updatePeerReviewMetadataPartialStub = null;
      args = null;
    });

    it('should call `updatePeerReviewMetadataPartial` with the correct arguments', function () {
      expect(updatePeerReviewMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`updatePeerReviewMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should append the cloned partial to the metadata table', function () {
      expect(args.metadataTable.contains(updatePeerReviewMetadataPartialStub.returnValues[0]), '`appendPeerReviewMetadataPartial` should append the cloned partial to the metadata table').to.be.true;
    });
  });
});
