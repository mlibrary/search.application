import { expect } from 'chai';
import { peerReviewPartial } from '../../../../../assets/scripts/datastores/partials/metadata/_peer_review.js';
import { plainTextPartial } from '../../../../../assets/scripts/datastores/partials/metadata/_plain_text.js';
import sinon from 'sinon';

describe('peer_review metadata partial', function () {
  let plainTextPartialStub = null;
  let args = null;

  beforeEach(function () {
    plainTextPartialStub = sinon.stub().callsFake(({ value }) => {
      return plainTextPartial({ value });
    });
    args = {
      plainText: plainTextPartialStub,
      value: { text: 'Sample text' }
    };

    // Apply HTML to the body by calling the function
    document.body.innerHTML = peerReviewPartial(args);
  });

  afterEach(function () {
    plainTextPartialStub = null;
    args = null;
  });

  describe('peerReviewPartial()', function () {
    it('should call `plainTextPartial` with the correct arguments', function () {
      expect(plainTextPartialStub.calledOnceWithExactly({ value: args.value }), '`plainTextPartial` should be called with the correct arguments').to.be.true;
    });

    it('should return the value text', function () {
      expect(document.body.textContent.includes(`${args.value.text}`), 'the text content should include the value text').to.be.true;
    });

    it('should create a peer-reviewed publication text', function () {
      expect(document.body.textContent.includes(`Peer-reviewed publication`), 'the text content should include "Peer-reviewed publication"').to.be.true;
    });
  });
});
