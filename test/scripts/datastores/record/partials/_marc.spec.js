import { expect } from 'chai';
import toggleMARCData from '../../../../../assets/scripts/datastores/record/partials/_marc.js';

describe('toggleMARCData', function () {
  let getButton = null;
  let getButtonAttribute = null;
  let getButtonText = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <section class="marc-data">
        <button class="marc-data__button" aria-expanded="false">
          View MARC data
        </button>
      </section>
    `;

    getButton = () => {
      return document.querySelector('.marc-data__button');
    };

    getButtonAttribute = (attribute = 'aria-expanded') => {
      return getButton().getAttribute(attribute);
    };

    getButtonText = () => {
      return getButton().innerHTML.trim();
    };

    // Call the function to apply the event listener
    toggleMARCData();
  });

  afterEach(function () {
    getButton = null;
    getButtonAttribute = null;
    getButtonText = null;

    // Remove the HTML of the body
    document.body.innerHTML = '';
  });

  it('should update the `aria-expanded` attribute', function () {
    expect(getButtonAttribute(), '`aria-expanded` should be set to `false` by default').to.equal('false');
    getButton().click();
    expect(getButtonAttribute(), '`aria-expanded` should be set to `true` after clicking').to.equal('true');
    getButton().click();
    expect(getButtonAttribute(), '`aria-expanded` should be set to `false` again after clicking').to.equal('false');
  });

  it('should update the `innerHTML`', function () {
    expect(getButtonText(), 'the button content should read `View MARC data` by default').to.equal('View MARC data');
    getButton().click();
    expect(getButtonText(), 'the button content should read `Hide MARC data` after clicking').to.equal('Hide MARC data');
    getButton().click();
    expect(getButtonText(), 'the button content should read `View MARC data` after clicking').to.equal('View MARC data');
  });
});
