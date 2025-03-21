import copyLink from '../../../../../assets/scripts/datastores/partials/actions/_link.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('copyLink', function () {
  const urlExample = 'https://example.com';
  let getButton = null;
  let clipboardSpy = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="actions__form link">
        <label for="action__link--input">Copy link</label>
        <input type="url" id="action__link--input" name="action__link--input" autocomplete="off" value="${urlExample}">
        <button class="link__copy" type="submit" disabled>Copy link</button>
      </form>
    `;

    getButton = () => {
      return document.querySelector('form button');
    };

    clipboardSpy = sinon.spy();
    global.navigator.clipboard = { writeText: clipboardSpy };
  });

  afterEach(function () {
    getButton = null;

    // Remove the HTML of the body
    document.body.innerHTML = '';

    // Clean up
    sinon.restore();
    delete global.navigator.clipboard;
  });

  it('should remove the `disabled` attribute from the button', function () {
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;

    // Call the function to apply the event listener
    copyLink();

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
});
