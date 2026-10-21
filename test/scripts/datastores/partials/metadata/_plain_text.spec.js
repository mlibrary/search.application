import { expect } from 'chai';
import { plainTextPartial } from '../../../../../assets/scripts/datastores/partials/metadata/_plain_text.js';

describe('plain_text metadata partial', function () {
  describe('plainTextPartial()', function () {
    it('should return the text value', function () {
      // Assign the arguments
      const args = { value: {
        text: 'Sample text'
      } };
      expect(plainTextPartial(args), '`plainTextPartial` should return the correct text value').to.equal(args.value.text);
    });
  });
});
