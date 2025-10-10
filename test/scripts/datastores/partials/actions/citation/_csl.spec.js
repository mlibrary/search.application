import { expect } from 'chai';
import { getCitationCSL } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_csl.js';

describe('csl', function () {
  let getTextArea = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl"></textarea>
      </div>
    `;

    getTextArea = () => {
      return document.querySelector('textarea');
    };
  });

  describe('getCitationCSL', function () {
    it('should return the citation CSL textarea', function () {
      expect(getCitationCSL()).to.deep.equal(getTextArea());
    });
  });

  afterEach(function () {
    getTextArea = null;
  });
});
