import { copyCitation, disableCopyCitationButton, getCopyCitationButton } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_copy-citation.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('copy-citation', function () {
  let getCitationCSL = null;
  let getTab = null;
  let getAlert = null;
  let getTextboxText = null;
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
      return document.querySelector('textarea.citation__csl')?.value?.trim();
    };

    getTab = () => {
      return document.querySelector('button[role="tab"]');
    };

    getAlert = () => {
      return document.querySelector('.actions__alert');
    };

    getTextboxText = () => {
      return document.querySelector('[role="textbox"]').textContent.trim();
    };

    getButton = () => {
      return document.querySelector('button.citation__copy');
    };

    // Check that CSL data exists
    expect(getCitationCSL(), 'CSL data should exist').to.not.be.empty.and.to.not.equal('[]');

    // Check that there is an active tab
    expect(getTab().getAttribute('aria-selected'), 'there should be an active tab').to.equal('true');

    // Check that the button is disabled at the start of each test
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;
  });

  describe('getCopyCitationButton', function () {
    it('should return the copy citation button element', function () {
      expect(getCopyCitationButton()).to.deep.equal(getButton());
    });
  });

  describe('disableCopyCitationButton', function () {
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

      // Call the function
      disableCopyCitationButton();

      // Check that the button is still disabled
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should still be set').to.be.true;
    });

    it('should disable the button if there is no selected tab', function () {
      // Unselect the tab
      getTab().setAttribute('aria-selected', 'false');

      // Call the function
      disableCopyCitationButton();

      // Check that the button is still disabled
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should still be set').to.be.true;
    });
  });

  describe('copyCitation', function () {
    let clipboardSpy = null;

    beforeEach(function () {
      // Enable the button
      disableCopyCitationButton();

      // Call the function
      copyCitation();

      // Spy on `navigator.clipboard.writeText`
      clipboardSpy = sinon.spy();
      Object.defineProperty(window.navigator, 'clipboard', {
        configurable: true,
        value: { writeText: clipboardSpy }
      });
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: window.navigator
      });

      // Check that the alert is hidden at the start of each test
      expect(getAlert().style.display, 'alert should be hidden').to.equal('none');

      // Click the button
      const clickEvent = new window.Event('click', { bubbles: true });
      getButton().dispatchEvent(clickEvent);
    });

    it('should generate the citation in the active tab when the button is clicked', function () {
      // Check that `navigator.clipboard.writeText` was called once
      expect(clipboardSpy.calledOnce, '`navigator.clipboard.writeText` should be called once').to.be.true;

      // Check that `navigator.clipboard.writeText` was called with the correct text
      expect(clipboardSpy.calledWith(getTextboxText()), '`navigator.clipboard.writeText` should be called with the correct text').to.be.true;
    });

    it('should make the alert visible when the button is clicked', function () {
      // Check that the alert is now visible
      expect(getAlert().style.display, 'alert should be visible').to.equal('block');
    });

    afterEach(function () {
      clipboardSpy = null;

      // Clean up
      delete global.navigator;
    });
  });

  afterEach(function () {
    getCitationCSL = null;
    getTab = null;
    getAlert = null;
    getTextboxText = null;
    getButton = null;
  });
});
