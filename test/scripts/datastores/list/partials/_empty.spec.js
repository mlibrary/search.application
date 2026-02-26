import { getEmptyListMessage, removeEmptyListMessage } from '../../../../../assets/scripts/datastores/list/partials/_empty.js';
import { expect } from 'chai';

describe('empty', function () {
  let getMessage = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__empty"></div>
    `;

    getMessage = () => {
      return document.querySelector('.list__empty');
    };

    // Check that the message exists
    expect(getMessage(), '`getMessage` should return the empty list message element').to.not.be.null;
  });

  afterEach(function () {
    getMessage = null;
  });

  describe('getEmptyListMessage()', function () {
    it('should return the empty list message element', function () {
      expect(getEmptyListMessage(), '`getEmptyListMessage` should return the empty list message element').to.equal(getMessage());
    });
  });

  describe('removeEmptyListMessage()', function () {
    it('should remove the empty list message element', function () {
      // Call the function
      removeEmptyListMessage({ emptyListMessage: getMessage() });

      // Check that the element was removed
      expect(getMessage(), '`removeEmptyListMessage` should remove the empty list message element').to.be.null;
    });
  });
});
