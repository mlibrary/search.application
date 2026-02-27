import { getListResults, removeListResults } from '../../../../../assets/scripts/datastores/list/partials/_results.js';
import { expect } from 'chai';

describe('results', function () {
  let getResults = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__results"></div>
    `;

    getResults = () => {
      return document.querySelector('.list__results');
    };

    // Check that the message exists
    expect(getResults(), '`getResults` should return the list results element').to.not.be.null;
  });

  afterEach(function () {
    getResults = null;
  });

  describe('getListResults()', function () {
    it('should return the list results element', function () {
      expect(getListResults(), '`getListResults` should return the list results element').to.equal(getResults());
    });
  });

  describe('removeListResults()', function () {
    it('should remove the list results element', function () {
      // Call the function
      removeListResults({ listResults: getResults() });

      // Check that the element was removed
      expect(getResults(), '`removeListResults` should remove the list results element').to.be.null;
    });
  });
});
