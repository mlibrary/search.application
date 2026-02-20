import { copyLink, copyToClipboard } from '../../../../../../assets/scripts/datastores/partials/actions/action/_link.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('copyLink', function () {
  const urlExample = 'https://example.com';
  let getAlert = null;
  let getInput = null;
  let getButton = null;
  let clipboardSpy = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__link--tabpanel">
        <div class="alert alert__success actions__alert" style="display: none;">
          Link copied!
        </div>
        <form class="actions__form link">
          <label for="action__link--input">Copy link</label>
          <input type="url" id="action__link--input" name="action__link--input" autocomplete="off" value="${urlExample}">
          <button class="link__copy" type="submit" disabled>Copy link</button>
        </form>
      </div>
    `;

    getAlert = () => {
      return document.querySelector('.alert');
    };

    getInput = () => {
      return document.querySelector('input[type="url"]');
    };

    getButton = () => {
      return document.querySelector('button');
    };

    clipboardSpy = sinon.spy();
    // Global.navigator = {};
    // Global.navigator.clipboard = { writeText: clipboardSpy };
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: clipboardSpy }
    });
    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: window.navigator
    });
  });

  afterEach(function () {
    getAlert = null;
    getInput = null;
    getButton = null;

    // Clean up
    delete global.navigator;
  });

  describe('copyToClipboard()', function () {
    let args = null;

    beforeEach(function () {
      args = { alert: getAlert(), text: getInput().value };

      // Check that the alert is hidden initially
      expect(getAlert().style.display, 'alert should not be displayed initially').to.equal('none');

      // Call the function
      copyToClipboard(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should show the alert', function () {
      expect(getAlert().style.display, 'alert should be displayed').to.equal('block');
    });

    it('should copy the text', function () {
      // Check that the clipboard should have been called with the correct value
      expect(clipboardSpy.calledOnce, 'should be called once').to.be.true;
      expect(clipboardSpy.calledWithExactly(getInput().value), `should be called with ${getInput().value}`).to.be.true;
    });
  });

  describe('copyLink()', function () {
    let copyToClipboardSpy = null;

    beforeEach(function () {
      copyToClipboardSpy = sinon.spy();

      // Check that the button is disabled initially
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;

      // Call the function
      copyLink({ copy: copyToClipboardSpy });
    });

    afterEach(function () {
      copyToClipboardSpy = null;
    });

    it('should remove the `disabled` attribute from the button', function () {
      expect(getButton().hasAttribute('disabled'), '`disabled` attribute should not exist').to.be.false;
    });

    it('should call `copyToClipboard` with the correct arguments', function () {
      // Click the button to trigger the action
      getButton().click();

      // Check that `copyToClipboard` should have been called with the correct arguments
      expect(copyToClipboardSpy.calledWithExactly({ alert: getAlert(), text: getInput().value }), '`copyToClipboard` should have been called with the correct arguments').to.be.true;
    });
  });
});
