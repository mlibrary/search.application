import copyCitation from '../../../../../assets/scripts/datastores/partials/actions/_citation.js';
import { expect } from 'chai';

describe('copyCitation', function () {
  let getTab = null;
  let getInput = null;
  let getButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
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

    getTab = () => {
      return document.querySelector('.citation__tablist button[role="tab"]');
    };

    getInput = () => {
      return document.querySelector('.citation__input');
    };

    getButton = () => {
      return document.querySelector('.citation__copy');
    };
  });

  afterEach(function () {
    getTab = null;
    getInput = null;
    getButton = null;
  });

  it('should remove the `disabled` attribute from the button', function () {
    // Check that the button is disabled
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;
    // Check that there is a selected tab and has an input
    expect(getTab().getAttribute('aria-selected'), 'Selected tab should be true').to.equal('true');
    expect(getInput()).to.exist;

    // Call the function to apply the event listener
    copyCitation();

    // Check that the button is no longer disabled
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should not exist').to.be.false;
  });

  it('should add the `disabled` attribute on the button if no tab is selected', function () {
    // Unselect the tab
    getTab().setAttribute('aria-selected', 'false');
    // Check that the button is disabled
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should be set').to.be.true;

    // Call the function to apply the event listener
    copyCitation();

    // Check that the button is still disabled
    expect(getButton().hasAttribute('disabled'), '`disabled` attribute should still be set').to.be.true;
  });
});
