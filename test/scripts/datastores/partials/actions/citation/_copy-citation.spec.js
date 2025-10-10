import { disableCopyCitationButton, getCopyCitationButton } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_copy-citation.js';
import { expect } from 'chai';

describe('copy-citation', function () {
  let getCitationCSL = null;
  let getTab = null;
  let getButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl">
          ${JSON.stringify(global.temporaryList)}
        </textarea>
        <div role="tablist" class="citation__tablist">
          <button type="button" role="tab" aria-selected="true" aria-controls="citation__mla--tabpanel">
            MLA
          </button>
        </div>
        <div id="citation__mla--tabpanel" role="tabpanel" class="citation__tabpanel" style="display: block;">
          <div class="alert alert__success actions__alert" style="display: none;">
            Citation copied to clipboard!
          </div>
          <div role="textbox" class="citation__input">
            This is an MLA citation.
          </div>
        </div>
        <button class="citation__copy" disabled>Copy citation</button>
      </div>
    `;

    getCitationCSL = () => {
      return document.querySelector('.citation textarea.citation__csl')?.value?.trim();
    };

    getTab = () => {
      return document.querySelector('button[role="tab"]');
    };

    getButton = () => {
      return document.querySelector('button.citation__copy');
    };
  });

  describe('getCopyCitationButton', function () {
    it('should return the copy citation button element', function () {
      expect(getCopyCitationButton()).to.deep.equal(getButton());
    });
  });

  describe('disableCopyCitationButton', function () {
    beforeEach(function () {
      // Check that CSL data exists
      expect(getCitationCSL(), 'CSL data should exist').to.not.be.empty.and.to.not.equal('[]');

      // Check that there is an active tab
      expect(getTab().getAttribute('aria-selected'), 'there should be an active tab').to.equal('true');

      // Check that the button is disabled at the start of each test
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;
    });

    it('should enable the button if there is CSL data and a selected tab', function () {
      // Call the function
      disableCopyCitationButton();

      // Check that the button is no longer disabled
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should not exist').to.be.false;
    });

    it('should disable the button if there is no CSL data', function () {
      // Remove CSL data
      document.querySelector('.citation textarea.citation__csl').textContent = '[]';
      expect(getCitationCSL(), 'CSL data should not exist').to.equal('[]');

      // Call the function to check the button state
      disableCopyCitationButton();

      // Check that the button is still disabled
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should still be set').to.be.true;
    });

    it('should disable the button if there is no selected tab', function () {
      // Unselect the tab
      getTab().setAttribute('aria-selected', 'false');

      // Call the function to check the button state
      disableCopyCitationButton();

      // Check that the button is still disabled
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should still be set').to.be.true;
    });
  });

  afterEach(function () {
    getCitationCSL = null;
    getTab = null;
    getButton = null;
  });
});
