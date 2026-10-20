import { browsePartial } from '../../../../../assets/scripts/datastores/partials/metadata/_browse.js';
import { expect } from 'chai';
import { linkToPartial } from '../../../../../assets/scripts/datastores/partials/metadata/_link_to.js';
import { plainTextPartial } from '../../../../../assets/scripts/datastores/partials/metadata/_plain_text.js';
import sinon from 'sinon';

describe('browse metadata partial', function () {
  let linkToPartialStub = null;
  let plainTextPartialStub = null;
  let args = null;

  beforeEach(function () {
    linkToPartialStub = sinon.stub().callsFake(({ value }) => {
      return linkToPartial({ value });
    });
    plainTextPartialStub = sinon.stub().callsFake(({ value }) => {
      return plainTextPartial({ value });
    });
    /* eslint-disable camelcase */
    args = {
      linkTo: linkToPartialStub,
      plainText: plainTextPartialStub,
      value: {
        browse_url: 'https://example.com/',
        kind: 'call_number',
        text: 'Sample text'
      }
    };
    /* eslint-enable camelcase */

    // Apply HTML to the body by calling the function
    document.body.innerHTML = browsePartial(args);
  });

  afterEach(function () {
    linkToPartialStub = null;
    plainTextPartialStub = null;
    args = null;
  });

  describe('browsePartial()', function () {
    it('should call `plainTextPartial` with the correct arguments', function () {
      expect(plainTextPartialStub.calledOnceWithExactly({ value: args.value }), '`plainTextPartial` should be called with the correct arguments').to.be.true;
    });

    it('should call `linkToPartial` with the correct arguments', function () {
      // Define the `url` property for the arguments
      args.value.url = 'https://example.com/';

      // Apply the HTML
      document.body.innerHTML = browsePartial(args);

      // Check that `linkToPartial` was called with the correct arguments
      expect(linkToPartialStub.calledOnceWithExactly({ value: args.value }), '`linkToPartial` should be called with the correct arguments').to.be.true;
    });

    it('should add an anchor that navigates to browse', function () {
      const anchor = document.querySelector('.metadata__list--browse-link a');
      expect(anchor, 'the anchor should exist').to.not.be.null;
      expect(anchor.innerHTML, 'the anchor should have the correct text').to.equal(`Browse in ${args.value.kind.replace('_', ' ')} list`);
      expect(anchor.href, 'the anchor should have the correct href').to.equal(args.value.browse_url);
    });
  });
});
