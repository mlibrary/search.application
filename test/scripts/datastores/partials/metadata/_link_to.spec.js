import { expect } from 'chai';
import { linkToPartial } from '../../../../../assets/scripts/datastores/partials/metadata/_link_to.js';

describe('link_to metadata partial', function () {
  describe('linkToPartial()', function () {
    it('should return an anchor with the correct `href` and text content', function () {
      const args = {
        value: {
          text: 'Sample text',
          url: 'https://example.com'
        }
      };
      expect(linkToPartial({ value: args.value }), '`linkToPartial` should return the correct link_to metadata partial').to.equal(`<a href="${args.value.url}">${args.value.text}</a>`);
    });
  });
});
