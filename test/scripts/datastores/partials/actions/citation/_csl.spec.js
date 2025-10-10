import { citationCSLChange, getCitationCSL } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_csl.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('csl', function () {
  let getTextArea = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl">
          ${JSON.stringify(global.temporaryList)}
        </textarea>
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

  describe('citationCSLChange', function () {
    let toggleCopyCitationButtonSpy = null;

    beforeEach(function () {
      toggleCopyCitationButtonSpy = sinon.spy();

      // Call the function
      citationCSLChange(toggleCopyCitationButtonSpy);
    });

    it('should call `toggleCopyCitationButton` when the CSL data changes', function () {
      // Change the data
      const changeEvent = new window.Event('change', { bubbles: true });
      getTextArea().dispatchEvent(changeEvent);

      // Check that `toggleCopyCitationButton` was called
      expect(toggleCopyCitationButtonSpy.calledOnce, '`toggleCopyCitationButton` should be called once').to.be.true;
    });

    afterEach(function () {
      toggleCopyCitationButtonSpy = null;
    });
  });

  afterEach(function () {
    getTextArea = null;
  });
});
