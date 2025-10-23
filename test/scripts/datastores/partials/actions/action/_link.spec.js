import copyLink from '../../../../../../assets/scripts/datastores/partials/actions/action/_link.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('copyLink', function () {
  const urlExample = 'https://example.com';
  let getButton = null;
  let getAlert = null;
  let clipboardSpy = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__link--tabpanel">
        <div class="alert alert__success actions__alert">
          Link copied!
        </div>
        <form class="actions__form link">
          <label for="action__link--input">Copy link</label>
          <input type="url" id="action__link--input" name="action__link--input" autocomplete="off" value="${urlExample}">
          <button class="link__copy" type="submit" disabled>Copy link</button>
        </form>
      </div>
    `;

    getButton = () => {
      return document.querySelector('button[type="submit"]');
    };

    getAlert = () => {
      return document.querySelector('.actions__alert');
    };

    clipboardSpy = sinon.spy();
    global.navigator = {};
    global.navigator.clipboard = { writeText: clipboardSpy };
  });

  afterEach(function () {
    getButton = null;
    getAlert = null;

    // Clean up
    delete global.navigator;
  });

  it('should remove the `disabled` attribute from the button', function () {
    // Check that the button is disabled
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;

    // Call the function to apply the event listener
    copyLink();

    // Check that the button is not disabled
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should not exist').to.be.false;
  });

  it('should copy the value of the input', function () {
    // Call the function to apply the event listener
    copyLink();
    getButton().click();

    // Check that the clipboard should have been called with the correct value
    expect(clipboardSpy.calledOnce, 'should be called once').to.be.true;
    expect(clipboardSpy.calledWith(urlExample), `should be called with ${urlExample}`).to.be.true;
  });

  it('should display the success alert', function () {
    // Check that the alert should not be displayed
    expect(getAlert().style.display, 'alert should not be displayed').to.equal('');

    // Call the function to apply the event listener
    copyLink();
    getButton().click();

    // Check that the alert is now displayed
    expect(getAlert().style.display, 'alert should be displayed').to.equal('block');
  });
});
